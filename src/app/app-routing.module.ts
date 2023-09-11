import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'carteira', loadChildren: () => import('./carteira/carteira.module').then( m => m.CarteiraPageModule)},
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)},
  { path: 'contact-us', loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)},
  { path: 'history', loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)},
  { path: 'map', loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)},
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)},
  { path: 'places', loadChildren: () => import('./places/places.module').then( m => m.PlacesPageModule)},
  { path: 'register', loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)},
  { path: 'splash', loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)},
  { path: 'summary', loadChildren: () => import('./summary/summary.module').then( m => m.SummaryPageModule)}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
