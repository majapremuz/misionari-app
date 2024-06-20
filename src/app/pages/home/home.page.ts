import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HeaderComponent } from 'src/app/pages/header/header.component';
import { FooterComponent } from 'src/app/pages/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent]
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

  openCategory(id: number){
    this.router.navigateByUrl('/categories/' + id);
  }

  async initTranslate(){
    this.translate['test_string'] = await this.dataCtrl.translateWord("TEST.STRING");
  }

}

