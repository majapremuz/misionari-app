import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HeaderComponent } from 'src/app/header/header.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { MenuComponent } from 'src/app/menu/menu.component';
import { CategoryService } from '../../../services/category.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent, MenuComponent]
})
export class CategoriesPage implements OnInit{
  selectedCategory: string = '';
  
  translate: any = [];

  contents: Array<ContentObject> = [];

  constructor(
    private router: Router,
    private dataCtrl: ControllerService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
    });
  }


  ionViewWillEnter(){
    this.dataCtrl.setHomePage(true);
    // do something when in moment home page opens
    this.test()
  }

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
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

    formatedCategory() : string {
      if (!this.selectedCategory || this.selectedCategory.length === 0) {
        return '';
      }
  
      return this.selectedCategory
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    goToTextPage(category: string) {
      this.router.navigate(['/text'], { queryParams: { category } });
    }


}
