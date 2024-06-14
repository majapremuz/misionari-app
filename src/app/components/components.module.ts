import { NgModule } from "@angular/core";

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { InfoComponent } from "./no-data/info.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { MenuComponent } from "../menu/menu.component";

@NgModule({
    imports: [IonicModule, CommonModule, HeaderComponent, FooterComponent, MenuComponent],
    declarations: [InfoComponent],
    exports: [InfoComponent]
})
export class ComponentsModule{}
