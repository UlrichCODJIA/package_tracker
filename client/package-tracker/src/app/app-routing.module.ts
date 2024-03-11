import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'tracker', loadChildren: () => import('./web-tracker/web-tracker.module').then(m => m.WebTrackerModule) },
  { path: 'driver', loadChildren: () => import('./web-driver/web-driver.module').then(m => m.WebDriverModule) },
  { path: 'admin', loadChildren: () => import('./web-admin/web-admin.module').then(m => m.WebAdminModule) },
  { path: '', redirectTo: '/tracker', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
