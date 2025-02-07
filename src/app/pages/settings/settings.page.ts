import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { AlertType, ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterComponent, FormsModule, TranslateModule]
})
export class SettingsPage implements OnInit {

  dataLoad: boolean = false;
  disableTogglers: boolean = false;
  disableSubscription: boolean = false;
  selectorIsOpen: boolean = false;

  notification_state: boolean = true;
  notification_subscript: boolean = false;

  contents: Array<ContentObject> = [];

  develop: boolean = false;

  constructor(
    private dataCtrl: ControllerService,
      private alertController: AlertController
    ) { }

  ngOnInit() {
    this.loadNotificationData();
  }


  async toggleNotification(event: any){
    this.disableTogglers = true;
    let response = await this.sendSettings();
    if(!response){
      this.notification_state = !this.notification_state;
    }
    this.disableTogglers = false;
  }

  async toggleNotificationSubscript(event: any){
    this.disableTogglers = true;
    let response = await this.sendSettings();
    if(!response){
      this.notification_subscript = !this.notification_subscript;
    }
    this.disableTogglers = false;
  } 

  async sendSettings(){
    const token = await this.dataCtrl._getNotificationTokenFromStorage();
    let token_str = (this.develop == true ? 'testTOKEN2' : token.token);

    let send_data = {
      token: token_str,
      content_enable: (this.notification_state == true ? 'Y' : 'N'),
      content_group: (this.notification_subscript == true ? 'N' : 'Y')
    };

    let response = await this.dataCtrl.putServer('/api/notification/content_notification/', send_data).catch(err => {
      return undefined;
    });

    
    if(this.notification_state == false) this.disableSubscription = true 
    else this.disableSubscription = false;

    if(response != undefined && response?.['message'] == 'success'){
      return true;
    }else{
      return false;
    }
  }

  async loadNotificationData(){
    await this.dataCtrl.showLoader();

    const token = await this.dataCtrl._getNotificationTokenFromStorage();
    let token_str = (this.develop == true ? 'testTOKEN2' : token.token);

    let response = await this.dataCtrl.getServer('/api/notification/content_notification/?token=' + token_str).catch(err => {
      return undefined;
    });

    if(response != undefined && response?.['message'] == 'success'){
      let data = response['data'][0];
      this.notification_state = (data['token_content_notification'] == 'Y' ? true : false);
      this.notification_subscript = (data['token_content_subscript'] == 'Y' ? false : true);

      if(this.notification_state == false){
        this.disableSubscription = true;
      }else{
        this.disableSubscription = false;
      }
    }else{
      this.disableTogglers = true;
    }

    this.dataLoad = true;
    await this.dataCtrl.hideLoader();
  }

  async selectGroup() {
    if(this.selectorIsOpen == false){
      this.selectorIsOpen = true;
      await this.loadData();
      const token = await this.dataCtrl._getNotificationTokenFromStorage();
      let token_str = (this.develop == true ? 'testTOKEN2' : token.token);

      if(token_str != ''){
        const state_settings = await this.getSubContent();


        let categories: Array<any> = [];
        this.contents.map((item, index) => {

          if(item.content_type == 'category'){
            let checked = false;
            state_settings.map(state_id => {
              if(state_id == item.content_id){
                checked = true;
              }
            });

            categories.push(
              {name: 'category' + index, type: 'checkbox', label: item.content_name, value: item.content_id, checked: checked}
            )
          }
        });

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
        this.selectorIsOpen = false;
      }else{
        let message = await this.dataCtrl.translateWord("MESSAGES.NO_TOKEN");
        this.dataCtrl.showToast(message, AlertType.Danger);
      }
    }
  }

  async sendCategories(categories: any){
      const token = await this.dataCtrl._getNotificationTokenFromStorage();
      let token_str = (this.develop == true ? 'testTOKEN2' : token.token);
  
      let url = '/api/notification/content_subscribe/?token=' + token_str;
  
      if(token_str != ''){
  
        await this.dataCtrl.showLoader();
  
        for (let i = 0; i < this.contents.length; i++) {
          let item = this.contents[i];
          url = url + '&content_id=' + item.content_id;
  
  
          if(categories.includes(item.content_id)){
            let response = await this.dataCtrl.putServer(url, []).catch(err => {
              console.log(err);
              return undefined;
            });
          }else{
            let response = await this.dataCtrl.deleteServer(url).catch(err => {
              console.log(err);
              return undefined;
            });
          }
        }
  
        await this.dataCtrl.hideLoader();
      }else{
        let message = await this.dataCtrl.translateWord("MESSAGES.NO_TOKEN");
        this.dataCtrl.showToast(message, AlertType.Danger);
      }
  } 

  async getSubContent(): Promise<Array<number>>{
    const token = await this.dataCtrl._getNotificationTokenFromStorage();
    let token_str = (this.develop == true ? 'testTOKEN2' : token.token);

    const url = `/api/notification/content_subscribe/?token=${token_str}`;

    if(token_str == ''){
      return [];
    }

    let response = await this.dataCtrl.getServer(url).catch(err => {
      return undefined;
    });

    if(response != undefined){
      let data = response.data;
      let data_array: Array<any> = [];

      if(data.length > 0){
        data.map((item: any) => {
          data_array.push(item['id']);
        });
      };

      return data_array;
    }else{
      return [];
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


    //const url_articles = `/api/content/group_of_group_offline/`;
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

}
