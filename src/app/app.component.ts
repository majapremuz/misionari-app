import { Component, ViewChild } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { TranslateConfigService } from './services/translate-config.service';
import { AlertType, ControllerService } from './services/controller.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { ContentApiInterface, ContentObject } from './model/content';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';
import { CompanySettingsApiInterface, CompanySettingsObject } from './model/app_settings';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet | undefined;
  dataLoad: boolean = false;
  contents: Array<ContentObject> = [];
  
  constructor(
    private router: Router,
    public platform: Platform,
    public translateConfigService: TranslateConfigService,
    public dataCtrl: ControllerService,
    private alertController: AlertController,
  ) {
    this.initApp();
  }

  async initApp(){
    await this.platform.ready();

    // define android exit app (whet user press back)
    this.platform.backButton.subscribeWithPriority(11, () => {

      if(this.routerOutlet != undefined){
        // ako vise nejde undo
        if (!this.routerOutlet.canGoBack()) {
          // ako je otvorena home stranica
          // onda iskljuci aplikaciju
          if(this.dataCtrl.getHomePageStatus() == true){
            App.exitApp();
          }
          else{
            this.router.navigateByUrl('/home');
          }
        }
        else{
          this.routerOutlet.pop();
        }
      }

    });

    this.translateConfigService.getDefaultLanguage();

    // provjera login
    // kreiranje ionic storage
    await this.dataCtrl.initFunc();

    await this.getAppSettings();

    this.setReadyPage();

    this.loadData();

  }

  selectCategory(id: number) {
    this.router.navigateByUrl('/categories/' + id);
 }

 async getAppSettings(){
  const url = '/api/user/app_settings/';

  // get data from server
  let app_settings = await this.dataCtrl.getServer(url, true, 20).catch(err => {
    this.dataCtrl.parseErrorMessage(err).then(message => {
      //this.dataCtrl.showToast(message.message, message.type);
      
      if(message.title == 'server_error'){
        // take some action e.g logout, change page
      }
    });
    return undefined;
  });

  if(app_settings != undefined){
    
    let settings_object = new CompanySettingsObject(app_settings.data);
  

    if(settings_object.show_message == true){
      let show_message = await this.dataCtrl.getStorage('UPDATE_MESSAGE');

      if(show_message != 'SET'){
          await this.dataCtrl.setStorage('UPDATE_MESSAGE', 'SET');
          const alert = await this.alertController.create({
            header: await this.dataCtrl.translateWord("UPDATE.TITLE"),
            subHeader: await this.dataCtrl.translateWord("UPDATE.SUB_TITLE") + ' v' + settings_object.company_app_version_display,
            message: await this.dataCtrl.translateWord("UPDATE.TEXT"),
            buttons: [await this.dataCtrl.translateWord("UPDATE.ACTION")],
          });
          await alert.present();
      }
    }
    
    // if(settings_object.show_update_page == true){
    //   // open update page
    // }
  }

 }

  async loadData() {

    const url_main_category = '/api/content/contents_main_group_offline'; 

    // get data from server
    let main_category = await this.dataCtrl.getServer(url_main_category, true, 20).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        //this.dataCtrl.showToast(message.message, message.type);
        
        if(message.title == 'server_error'){
          // take some action e.g logout, change page
        }
      });
      return undefined;
    });

    let id = 0;
    if(main_category != undefined){
      main_category.data.data.map((item: ContentApiInterface)  => {
        let category = new ContentObject(item);
        if(id == 0){
          id = category.content_id;
        }
        if(category.content_id < id){
          id = category.content_id;
        }
      })
    }


    const url_articles = `/api/content/contents_offline/?id=${id}`;

    try {
      const articles_data = await this.dataCtrl.getServer(url_articles, true, 20);
      this.contents = articles_data.data.data.map((item: ContentApiInterface) => new ContentObject(item));
      this.dataLoad = true;
    } catch (err) {
      const message = await this.dataCtrl.parseErrorMessage(err);
      this.dataCtrl.showToast(message.message, message.type);
      if (message.title == 'server_error') {
        // take some action e.g logout, change page
      }
    }
  }

  async openSettings() {

    const state_settings = await this.getTokenSettings();

    let categories: Array<any> = [];
    this.contents.map((item, index) => {
      let checked = false;
      state_settings.map(state_id => {
        if(state_id == item.content_id){
          checked = true;
        }
      });

      categories.push(
        {name: 'category' + index, type: 'checkbox', label: item.content_name, value: item.content_id, checked: checked}
      )
    })
    const alert = await this.alertController.create({
      header: await this.dataCtrl.translateWord("MENU.CHOOSE_CATEGORY"),
      inputs: categories,
      buttons: [
        { 
          text: await this.dataCtrl.translateWord("MENU.CANCEL"),
          role: 'cancel' },
        {
          text: await this.dataCtrl.translateWord("MENU.SUBSCRIBE"),
          handler: (selectedCategories: string[]) => {
            this.sendCategories(selectedCategories);
          }
        }
      ]
    });

    await alert.present();
  }

  async getTokenSettings(): Promise<Array<number>>{
    const token = await this.dataCtrl._getNotificationTokenFromStorage();
    const url = `/api/notification/token_settings/?token=${token.token}`;

    if(token.token == ''){
      return [];
    }

    let response = await this.dataCtrl.getServer(url).catch(err => {
      return undefined;
    })

    if(response != undefined){
      let obj = JSON.parse(response.data.token_content_settings);
      if(obj != null){
        return JSON.parse(response.data.token_content_settings).content;
      }else{
        return [];
      }
    }else{
      return [];
    }
  }

  async sendCategories(categories: any){
    const url = '/api/notification/token_settings/';

    const token = await this.dataCtrl._getNotificationTokenFromStorage();

    const data = {
      token: token.token,
      company: environment.company_id,
      notification_state: JSON.stringify({content: categories})
    };

    if(token.token != ''){
      await this.dataCtrl.showLoader();

      let response = await this.dataCtrl.postServer(url, data).catch(err => {
        console.log(err);
        return undefined;
      })
  
      if(response != undefined){
        let tr_success = await this.dataCtrl.translateWord("MENU.SUBSCRIBE_SUCCESS");
        this.dataCtrl.showToast(tr_success, AlertType.Success);
      }
  
      await this.dataCtrl.hideLoader();
    }else{
      let message = await this.dataCtrl.translateWord("MESSAGES.NO_TOKEN");
      this.dataCtrl.showToast(message, AlertType.Danger);
    }
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  async setReadyPage(){
    // nakon sto se stranica pokrene ugasiti splash screen
    if(this.platform.is('cordova') || this.platform.is('capacitor')){
      await SplashScreen.hide();
      await StatusBar.show();

      // crna slova na statusbaru
      //await StatusBar.setStyle({ style: Style.Light });

      // pokreni inicijalizaciju notifikacija
      await this.initNotifications();
    }

    // izvrisit sve provjere i funkcije prije ove funkcije
    // jer tek kad se pokrene ova funkcija dozvoljava se 
    // pokretanje prve stranice
    this.dataCtrl.setReadyPage();
  }

  async initNotifications(){
    //this.dataCtrl.setNotificationToken(token);
    let result = await PushNotifications.requestPermissions();
    if (result.receive === 'granted') {
      await PushNotifications.register();
      this.addNotificationsListener();
    } else {
      // Show some error
    }
  }

  addNotificationsListener(){
    PushNotifications.addListener('registration', (token: Token) => {
      // Push Notifications registered successfully.
      // Send token details to API to keep in DB.
      console.log(token);
      this.dataCtrl.setNotificationToken(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      // Handle push notification registration error here.
      console.log('Notification registrationError');

    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // Show the notification payload if the app is open on the device.
      }
    );

    PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          // Implement the needed action to take when user tap on a notification.
          if(notification.actionId == 'tap'){
            //
          }

          console.log('notification-tap', notification);
        }
    );
  }
}
