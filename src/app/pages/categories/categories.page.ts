import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { CachedImageComponent } from 'src/app/components/cached-image/cached-image.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterComponent, CachedImageComponent]
})
export class CategoriesPage implements OnInit{
  dataLoad: boolean = false;
  translate: any = [];

  contents: Array<ContentObject> = [];
  category!: ContentObject;

  constructor(
    private dataCtrl: ControllerService,
    private router: Router,
    private route: ActivatedRoute,
    private contentCtrl: DataService
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
    this.category = await this.contentCtrl.getContent(id_content);
    let categories = await this.contentCtrl.getCategoryContent(id_content);

    if(categories.length > 0){
      this.contents = [];
      categories.map((item) => {
        this.contents.push(item);
      })
    }

    this.dataLoad = true;
  }

  openCategory(id: number){
    this.router.navigateByUrl('/categories/' + id);
  }

  openText(content: ContentObject){
    if(content.content_type == 'category'){
      this.router.navigateByUrl('/categories/' + content.content_id);
    }else{
      this.router.navigateByUrl('/text/' + content.content_id);
    }
  }

}
