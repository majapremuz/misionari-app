import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HeaderComponent } from 'src/app/pages/header/header.component';
import { FooterComponent } from 'src/app/pages/footer/footer.component';
import { MenuComponent } from 'src/app/pages/menu/menu.component';
import { CategoryService } from '../services/category.service';


@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent, MenuComponent]
})
export class TextPage implements OnInit {

  content!: ContentObject;
  dataLoad: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataCtrl: ControllerService
  ) { }

  ngOnInit() {
    //
  }

  ionViewWillEnter(){
    const id_content = parseInt(this.route.snapshot.paramMap.get('id') || '1', 10);
    this.getData(id_content);
  }

  async getData(id: number){
    const url_category = '/api/content/content_offline/?id=' + id;

    // show loader
    await this.dataCtrl.showLoader();

    // get data from server
    let article_data = await this.dataCtrl.getServer(url_category, true, 20).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);
        
        if(message.title == 'server_error'){
          // take some action e.g logout, change page
        }
      });
      return undefined;
    });

    if(article_data != undefined){
      this.content = new ContentObject(article_data.data);

      console.log(this.content);
    }

    this.dataLoad = true;

    // hide loader
    await this.dataCtrl.hideLoader();

  }


/* async initTranslate(){
  this.translate['test_string'] = await this.dataCtrl.translateWord("TEST.STRING");
}*/


}
