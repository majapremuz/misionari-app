import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ReadyPageGuard } from './guards/ready-page.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'categories/:id',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'text/:id',
    loadChildren: () => import('./pages/text/text.module').then( m => m.TextPageModule),
    canLoad: [ReadyPageGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
