import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

import { WebDriverRoutingModule } from './web-driver-routing.module';
import { WebDriverComponent } from './web-driver.component';
import { DriverComponent } from './driver/driver.component';


@NgModule({
  declarations: [
    WebDriverComponent,
    DriverComponent
  ],
  imports: [
    CommonModule,
    WebDriverRoutingModule,
    GoogleMapsModule
  ]
})
export class WebDriverModule { }
