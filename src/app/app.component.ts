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
import { BaseModal } from './model/modal';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet | undefined;
  dataLoad: boolean = false;
  contents: Array<ContentObject> = [];

  subscribeModal= new BaseModal();
  
  constructor(
    private router: Router,
    public platform: Platform,
    public translateConfigService: TranslateConfigService,
    public dataCtrl: ControllerService,
    private alertController: AlertController,
    private contentCtrl: DataService
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

 async loadData(){
  let rootContent = await this.contentCtrl.getRootContent();

  if(rootContent.length > 0){
    let rootContent_id = rootContent[0]['content_id'];

    let homePageCategory = await this.contentCtrl.getCategoryContent(rootContent_id);

    if(homePageCategory.length > 0){
      this.contents = [];
      homePageCategory.map((item) => {
        this.contents.push(item);
      })
    }

    this.dataLoad = true;

  }
 }

  async loadData_old() {

    // const url_main_category = '/api/content/contents_main_group_offline'; 

    // // get data from server
    // let main_category = await this.dataCtrl.getServer(url_main_category, true, 20).catch(err => {
    //   this.dataCtrl.parseErrorMessage(err).then(message => {
    //     //this.dataCtrl.showToast(message.message, message.type);
        
    //     if(message.title == 'server_error'){
    //       // take some action e.g logout, change page
    //     }
    //   });
    //   return undefined;
    // });

    // let id = 0;
    // if(main_category != undefined){
    //   main_category.data.data.map((item: ContentApiInterface)  => {
    //     let category = new ContentObject(item);
    //     if(id == 0){
    //       id = category.content_id;
    //     }
    //     if(category.content_id < id){
    //       id = category.content_id;
    //     }
    //   })
    // }


    // //const url_articles = `/api/content/group_of_group_offline/`;
    // const url_articles = `/api/content/contents_offline/?id=${id}`;

    // try {
    //   const articles_data = await this.dataCtrl.getServer(url_articles, true, 20);
    //   this.contents = articles_data.data.data.map((item: ContentApiInterface) => new ContentObject(item));
    //   this.dataLoad = true;
    // } catch (err) {
    //   const message = await this.dataCtrl.parseErrorMessage(err);
    //   this.dataCtrl.showToast(message.message, message.type);
    //   if (message.title == 'server_error') {
    //     // take some action e.g logout, change page
    //   }
    // }
  }

  async openSettings(){
    this.router.navigate(['/settings']);
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

      // Display content under transparent status bar
      //await StatusBar.setOverlaysWebView({ overlay: false });

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
            let notification_data = notification?.['notification']?.['data'] || null;
            if(notification_data != null){
              let action = notification_data?.['action'] || null;
              let content_id = notification_data?.['content_id'] || null;
              let parent_id = notification_data?.['parent_id'] || null;

              if(action != null){
                if(action == 'open_text' && content_id != null){
                  this.router.navigateByUrl('/text/' + content_id);
                }else if(action == 'open_parent' && parent_id != null){
                  this.router.navigateByUrl('/categories/' + parent_id);
                }
              }
            }
          }

          console.log('notification-tap', notification);
        }
    );
  }
}
