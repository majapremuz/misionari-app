import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NativeService } from '../../services/native.service';
import { environment } from 'src/environments/environment';
import { ImageObject } from '../../model/image';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterComponent]
})
export class TextPage implements OnInit {

  content!: ContentObject;
  dataLoad: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataCtrl: ControllerService,
    private nativeCtrl: NativeService,
    private contentCtrl: DataService
  ) { }

  ngOnInit() {
    //
  }

  ionViewWillEnter(){
    const id_content = parseInt(this.route.snapshot.paramMap.get('id') || '1', 10);
    this.getData(id_content);
  }

  async getData(id: number){
    this.content = await this.contentCtrl.getContent(id);

    console.log(this.content);
    this.dataLoad = true;
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
