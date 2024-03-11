import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { PackageTrackingComponent } from './app/package-tracking/package-tracking.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(PackageTrackingComponent, config);

export default bootstrap;
