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
import { SoundService } from 'src/app/services/sound.service';
import { AudioComponent } from 'src/app/components/audio/audio.component';


@Component({
  selector: 'app-text',
  templateUrl: './text.page.html',
  styleUrls: ['./text.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FooterComponent, AudioComponent]
})
export class TextPage implements OnInit {

  content!: ContentObject;
  dataLoad: boolean = false;

  main_image: string = '';
  url: string = 'https://file-examples.com/storage/fe1b07b09f67bcb9b96354c/2017/11/file_example_MP3_700KB.mp3';

  constructor(
    private route: ActivatedRoute,
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

    //load cache image
    this.main_image = await this.nativeCtrl.getImage(this.content.content_image_obj?.full_url || '');

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
