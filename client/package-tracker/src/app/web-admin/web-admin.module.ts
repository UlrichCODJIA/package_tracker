import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

import { WebAdminRoutingModule } from './web-admin-routing.module';
import { WebAdminComponent } from './web-admin.component';
import { HomeComponent } from './home/home.component';
import { CreatePackageComponent } from './create-package/create-package.component';
import { CreateDeliveryComponent } from './create-delivery/create-delivery.component';


@NgModule({
  declarations: [
    WebAdminComponent,
    HomeComponent,
    CreatePackageComponent,
    CreateDeliveryComponent
  ],
  imports: [
    CommonModule,
    WebAdminRoutingModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class WebAdminModule { }
