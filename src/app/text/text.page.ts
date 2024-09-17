import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HeaderComponent } from 'src/app/pages/header/header.component';
import { FooterComponent } from 'src/app/pages/footer/footer.component';
import { NativeService } from '../services/native.service';
import { environment } from 'src/environments/environment';
import { ImageObject } from '../model/image';


@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent]
})
export class TextPage implements OnInit {

  content!: ContentObject;
  dataLoad: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataCtrl: ControllerService,
    private nativeCtrl: NativeService
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
        console.log(this.dataCtrl)
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

  openAttachment(item: ImageObject){
    let url = '';
    if(item.image == true){
      url = environment.rest_server.protokol + environment.rest_server.host + '/Assets/multimedia/original/' + item.full_url;
    }else{
      url = environment.rest_server.protokol + environment.rest_server.host + '/Assets/multimedia/' + item.multimedia_file;
    }

    this.nativeCtrl.openInBrowser(url);
  }
}
