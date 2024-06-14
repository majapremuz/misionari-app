import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { PushNotificationService } from '../services/push-notification-service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
  standalone: true
})
export class MenuComponent  implements OnInit {

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private pushNotificationService: PushNotificationService, 
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  selectCategory(category: string) {
    this.router.navigate(['/categories']);
    this.categoryService.setSelectedCategory(category);
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
            selectedCategories.forEach(category => this.pushNotificationService.subscribeToTopic(category));
          }
        }
      ]
    });

    await alert.present();
  }

}
