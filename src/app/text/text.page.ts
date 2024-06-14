import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HeaderComponent } from 'src/app/header/header.component';
import { FooterComponent } from 'src/app/footer/footer.component';
import { MenuComponent } from 'src/app/menu/menu.component';
import { CategoryService } from '../services/category.service';


@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent, MenuComponent]
})
export class TextPage implements OnInit {
  selectedCategory: string = '';
  category: string = '';

  contents: Array<ContentObject> = [];
  
  ionViewWillEnter(){
    this.dataCtrl.setHomePage(true);
    // do something when in moment home page opens
    this.test()
  }

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
  }


  constructor(
    private route: ActivatedRoute,
    private dataCtrl: ControllerService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
    });

    this.categoryService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category;
    });
  }

  async test(){

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
