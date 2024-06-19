import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HeaderComponent } from 'src/app/pages/header/header.component';
import { FooterComponent } from 'src/app/pages/footer/footer.component';
import { MenuComponent } from 'src/app/pages/menu/menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent, MenuComponent]
})
export class HomePage {

  dataLoad: boolean = false;
  translate: any = [];

  contents: Array<ContentObject> = [];
  category!: ContentObject;

  constructor(
    private dataCtrl: ControllerService,
    private router: Router
  ) {
    /*this.initTranslate();*/
  }


  ionViewWillEnter(){
    this.dataCtrl.setHomePage(true);
    // do something when in moment home page opens
    this.getData()
  }

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
  }

  async getData(){

    const url_category = '/api/content/content_offline/?id=70'; // category id 70 is hardcoded in admin 
    const url_articles = '/api/content/contents_offline/?id=70'; // category id 70 is hardcoded in admin 

    // show loader
    await this.dataCtrl.showLoader();

    // get data from server
    let category_data = await this.dataCtrl.getServer(url_category, true, 20).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);
        
        if(message.title == 'server_error'){
          // take some action e.g logout, change page
        }
      });
      return undefined;
    });


    if(category_data != undefined){
      this.category = new ContentObject(category_data.data);
    }

    // get data from server
    let articles_data = await this.dataCtrl.getServer(url_articles, true, 20).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);
        
        if(message.title == 'server_error'){
          // take some action e.g logout, change page
        }
      });
      return undefined;
    });

    if(articles_data != undefined){
      this.contents = [];
      articles_data.data.data.map((item: ContentApiInterface) => {
        this.contents.push(new ContentObject(item));
      });
    }

    this.dataLoad = true;

    // hide loader
    await this.dataCtrl.hideLoader();

  }

  openArticle(id: number){
    this.router.navigateByUrl('/text/' + id);
  }

  /**
   * This funcion get content from API node
   */
  async test(){

      /**
   
      API nodes

      /api/content/newest_contents_offline
      - get the newest content

      /api/content/contents_main_group_offline/
      - get main categories of the contents

      /api/content/contents_all_group_offline/
      - get all categories of the contents

      /api/content/contents_offline/?id=xxx&page_size=xxx&page=xxx
      - get all contents from categorory

      /api/content/content_offline/?id=xxx
      - get content details

      */


    let url = '/api/content/contents_main_group_offline';

    // show loader
    await this.dataCtrl.showLoader();

    // get data from server
    let data = await this.dataCtrl.getServer(url, true, 20).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);
        
        if(message.title == 'server_error'){
          // take some action e.g logout, change page
        }
      });
      return undefined;
    });

    // hide loader
    await this.dataCtrl.hideLoader();


    if(data != undefined){
      console.log('data is loaded', data.data);
    
      console.log('JSON data:', JSON.stringify(data.data));
      data.data.map((item: ContentApiInterface) => {
        this.contents.push(new ContentObject(item));
      });

    }

  }

 /* async initTranslate(){
    this.translate['test_string'] = await this.dataCtrl.translateWord("TEST.STRING");
  }*/

}

