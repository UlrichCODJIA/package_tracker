import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { PackageTrackingComponent } from './app/package-tracking/package-tracking.component';

bootstrapApplication(PackageTrackingComponent, appConfig)
  .catch((err) => console.error(err));
