import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

import { WebTrackerRoutingModule } from './web-tracker-routing.module';
import { TrackerComponent } from './tracker/tracker.component';


@NgModule({
  declarations: [
    TrackerComponent
  ],
  imports: [
    CommonModule,
    WebTrackerRoutingModule,
    GoogleMapsModule
  ]
})
export class WebTrackerModule { }
