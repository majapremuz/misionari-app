import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { AlertController } from '@ionic/angular';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class MenuComponent implements OnInit {
  dataLoad: boolean = false;
  contents: Array<ContentObject> = [];

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private alertController: AlertController,
    private dataCtrl: ControllerService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    const url_articles = '/api/content/contents_main_group_offline'; // category id 70 is hardcoded in admin

    try {
      const articles_data = await this.dataCtrl.getServer(url_articles, true, 20);
      this.contents = articles_data.data.data.map((item: ContentApiInterface) => new ContentObject(item));
      this.dataLoad = true;
    } catch (err) {
      const message = await this.dataCtrl.parseErrorMessage(err);
      this.dataCtrl.showToast(message.message, message.type);
      if (message.title == 'server_error') {
        // take some action e.g logout, change page
      }
    }
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  selectCategory(id: number) {
     this.router.navigateByUrl('/categories/' + id);
  }

  async openSettings() {
    const alert = await this.alertController.create({
      header: 'Odaberite kategorije',
      inputs: [
        { name: 'category1', type: 'checkbox', label: 'ŽIVA RIJEČ - EVANĐELJE DANA', value: 'ŽIVA RIJEČ - EVANĐELJE DANA' },
        { name: 'category2', type: 'checkbox', label: 'S GAŠPAROM KROZ DAN', value: 'S GAŠPAROM KROZ DAN' },
        { name: 'category3', type: 'checkbox', label: 'MARIJA DE MATTIAS GOVORI', value: 'MARIJA DE MATTIAS GOVORI' },
        { name: 'category4', type: 'checkbox', label: 'MOLITVENIK DRAGOCJENE KRVI', value: 'MOLITVENIK DRAGOCJENE KRVI' },
        { name: 'category5', type: 'checkbox', label: 'NAŠI SVECI', value: 'NAŠI SVECI' },
        { name: 'category6', type: 'checkbox', label: 'NAŠE SVETKOVINE', value: 'NAŠE SVETKOVINE' },
        { name: 'category7', type: 'checkbox', label: 'LITURGIJA ČASOVA', value: 'LITURGIJA ČASOVA' }
      ],
      buttons: [
        { text: 'Prekid', role: 'cancel' },
        {
          text: 'Pretplata',
          handler: (selectedCategories: string[]) => {
            // Handle subscription logic
          }
        }
      ]
    });

    await alert.present();
  }
}
