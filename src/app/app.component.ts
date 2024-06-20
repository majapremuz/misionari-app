import { Component, ViewChild } from '@angular/core';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { TranslateConfigService } from './services/translate-config.service';
import { ControllerService } from './services/controller.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { ContentApiInterface, ContentObject } from './model/content';

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

    this.setReadyPage();

    this.loadData();

  }

  selectCategory(id: number) {
    this.router.navigateByUrl('/categories/' + id);
 }

  async loadData() {
    const url_articles = '/api/content/contents_offline/?id=70'; // category id 70 is hardcoded in admin

    try {
      const articles_data = await this.dataCtrl.getServer(url_articles, true, 20);

      console.log(articles_data.data);
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
    const alert = await this.alertController.create({
      header: 'Odaberite kategorije',
      inputs: [
        { name: 'category1', type: 'checkbox', label: 'ŽIVA RIJEČ - EVANĐELJE DANA', value: 'ŽIVA RIJEČ - EVANĐELJE DANA' },
        { name: 'category2', type: 'checkbox', label: 'S GAŠPAROM KROZ DAN', value: 'S GAŠPAROM KROZ DAN' },
        { name: 'category3', type: 'checkbox', label: 'MARIJA DE MATTIAS GOVORI', value: 'MARIJA DE MATTIAS GOVORI' },
        { name: 'category4', type: 'checkbox', label: 'MOLITVENIK DRAGOCJENE KRVI', value: 'MOLITVENIK DRAGOCJENE KRVI' },
        { name: 'category5', type: 'checkbox', label: 'NAŠI SVECI', value: 'NAŠI SVECI' },
        { name: 'category6', type: 'checkbox', label: 'NAŠE SVETKOVINE', value: 'NAŠE SVETKOVINE' },
        { name: 'category7', type: 'checkbox', label: 'LITURGIJA ČASOVA', value: 'LITURGIJA ČASOVA' }
      ],
      buttons: [
        { text: 'Prekid', role: 'cancel' },
        {
          text: 'Pretplata',
          handler: (selectedCategories: string[]) => {
            // Handle subscription logic
          }
        }
      ]
    });

    await alert.present();
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
      // await this.initNotifications();
    }

    // izvrisit sve provjere i funkcije prije ove funkcije
    // jer tek kad se pokrene ova funkcija dozvoljava se 
    // pokretanje prve stranice
    this.dataCtrl.setReadyPage();
  }
}
