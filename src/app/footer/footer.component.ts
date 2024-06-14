import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class FooterComponent {

  constructor(
    private router: Router,
    private navCtrl: NavController
  ) { }

  clickToHomePage() {
    this.router.navigate(["/home"]);
  }

  backButtonEvent() {
    this.navCtrl.back();
  }

}
