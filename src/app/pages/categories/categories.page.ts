import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent]
})
export class CategoriesPage implements OnInit{
  dataLoad: boolean = false;
  translate: any = [];

  contents: Array<ContentObject> = [];
  category!: ContentObject;

  constructor(
    private dataCtrl: ControllerService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    //
  }

  ionViewWillEnter(){
    const id_content = parseInt(this.route.snapshot.paramMap.get('id') || '1', 10);
    this.getData(id_content);
  }

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
  }

  async getData(id_content: number){
    const url_category = `/api/content/content_offline/?id=${id_content}`;
    const url_articles = `/api/content/contents_offline/?id=${id_content}`;

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

  openText(content: ContentObject){
    console.log(content);
    if(content.content_type == 'category'){
      this.router.navigateByUrl('/categories/' + content.content_id);
    }else{
      this.router.navigateByUrl('/text/' + content.content_id);
    }
  }

}
