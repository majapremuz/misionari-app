import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, TranslateModule]
})
export class HeaderComponent  implements OnInit {

  translate: any = [];

  constructor(
    private dataCtrl: ControllerService
  ) { 
    //
  }

  ngOnInit() {
    this.initTranslate();
  }

  async initTranslate(){
    this.translate['title'] = await this.dataCtrl.translateWord("HEADER.TITLE");
    this.translate['sub_title'] = await this.dataCtrl.translateWord("HEADER.SUB_TITLE");

  }

}
