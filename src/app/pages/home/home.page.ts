import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CachedImageComponent } from 'src/app/components/cached-image/cached-image.component';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterComponent, CachedImageComponent]
})
export class HomePage {

  dataLoad: boolean = false;
  translate: any = [];

  contents: Array<ContentObject> = [];
  category!: ContentObject;

  constructor(
    private dataCtrl: ControllerService,
    private contentCtrl: DataService,
    private router: Router
  ) {
    //
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
    let rootContent = await this.contentCtrl.getRootContent();

    if(rootContent.length > 0){
      let rootContent_id = rootContent[0]['content_id'];

      this.category = await this.contentCtrl.getContent(rootContent_id);
      
      let homePageCategory = await this.contentCtrl.getCategoryContent(rootContent_id);

      if(homePageCategory.length > 0){
        this.contents = [];
        homePageCategory.map((item) => {
          this.contents.push(item);
        })
      }
    }
    this.dataLoad = true;
  }

  openCategory(id: number){
    this.router.navigateByUrl('/categories/' + id);
  }

}

