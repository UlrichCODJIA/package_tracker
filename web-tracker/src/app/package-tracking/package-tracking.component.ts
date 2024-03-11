import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { LoggerModule, NGXLogger } from "ngx-logger";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Subscription, Subject, debounceTime, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { MapboxLoaderService } from '../mapbox-loader.service';
import { PackageService } from '../package.service';
import { DeliveryService } from '../delivery.service';
import { WebSocketService } from '../web-socket.service';
import { ErrorHandlerService } from '../error-handler.service'; // New error handler service
import { MapService } from '../map.service'; // New map service

export interface Location {
  lat: number;
  lng: number;
}

export interface PackageDetails {
  package_id: string;
  active_delivery_id: string | null;
  description: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  from: {
    name: string;
    address: string;
    location: Location;
  };
  to: {
    name: string;
    address: string;
    location: Location;
  };
}

export interface DeliveryDetails {
  delivery_id: string;
  package_id: string;
  pickup_time: Date;
  start_time: Date;
  end_time: Date;
  location: Location;
  status: 'open' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';
}

@Component({
  selector: 'app-package-tracking',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, LoggerModule],
  templateUrl: './package-tracking.component.html',
  styleUrls: ['./package-tracking.component.css'],
  providers: [PackageService, DeliveryService, WebSocketService, ErrorHandlerService, MapService]
})

export class PackageTrackingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  packageId: string = '';
  packageDetails: PackageDetails | null = null;
  deliveryDetails: DeliveryDetails | null = null;
  mapWidth = '100%';
  mapHeight = '800px';
  mapCenter: Location = { lat: 0, lng: 0 };
  mapZoom = 5;
  private routeRefreshInterval = 20000;
  private packageSubscription?: Subscription;
  private deliverySubscription?: Subscription;
  private webSocketSubscription?: Subscription;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private logger: NGXLogger,
    private mapboxLoaderService: MapboxLoaderService,
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService,
    private errorHandlerService: ErrorHandlerService, // Inject the error handler service
    private mapService: MapService, // Inject the map service
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMapbox()
        .then(() => {
          if (!environment.mapboxAccessToken) {
            this.errorHandlerService.handleError('Mapbox Access Token is not provided');
            return;
          }

          this.setupMapCenterUpdates();
        })
        .catch(error => this.errorHandlerService.handleError(error));
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.webSocketSubscription?.unsubscribe();
    this.packageSubscription?.unsubscribe();
    this.deliverySubscription?.unsubscribe();
    this.mapService.removeMap();
  }

  loadMapbox(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js';
        script.async = true;
        script.onload = () => {
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Failed to load Mapbox GL JS'));
        };
        document.body.appendChild(script);

        // Add a timeout for script loading
        const timeout = setTimeout(() => {
          reject(new Error('Mapbox GL JS script loading timed out'));
        }, 10000); // Adjust the timeout value as needed

        script.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
      } else {
        console.log('Skipping Mapbox load in non-browser environment');
        resolve();
      }
    });
  }

  trackPackage() {
    this.packageSubscription = this.packageService.getPackageById(this.packageId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        packageData => {
          this.packageDetails = packageData;
          if (packageData.active_delivery_id) {
            this.getDeliveryDetails(packageData.active_delivery_id);
            this.initWebSocket();
          }
        },
        error => {
          this.errorHandlerService.handleError('Error fetching package details:', error);
        }
      );
  }

  getDeliveryDetails(deliveryId: string) {
    this.deliverySubscription = this.deliveryService.getDeliveryById(deliveryId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        deliveryData => {
          this.deliveryDetails = deliveryData;
          this.mapService.initMap(this.mapContainer.nativeElement, this.mapCenter, this.mapZoom);
          this.updateDistances();
          this.mapService.drawRoute(this.packageDetails!.from.location, this.deliveryDetails!.location);
        },
        error => {
          this.errorHandlerService.handleError('Error fetching delivery details:', error);
        }
      );
  }

  initWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const webSocketUrl = environment.webSocketUrl || `${wsProtocol}://localhost:5000`;
    this.webSocketService.connect(webSocketUrl);
    this.webSocketSubscription = this.webSocketService.messages$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        updatedDelivery => {
          if (updatedDelivery.package_id === this.packageId) {
            this.deliveryDetails = updatedDelivery;
            if (this.deliveryDetails) {
              this.updateMapCenter(this.deliveryDetails.location);
            }
          }
        },
        error => {
          this.errorHandlerService.handleError('WebSocket error:', error);
        }
      );
    if (this.webSocketService.connectionClosed$) {
      setTimeout(() => this.initWebSocket(), 5000);
    }
  }

  updateMapCenter(location: Location) {
    this.mapCenter = location;
    this.mapService.updateMapCenter(this.mapCenter);
  }

  setupMapCenterUpdates() {
    this.mapService.mapCenterUpdates$
      .pipe(
        debounceTime(500),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe(location => {
        this.mapCenter = location;
        this.mapService.addMarkers(this.packageDetails, this.deliveryDetails);
      });
  }

  ngAfterViewInit() {
    this.mapboxLoaderService.loadMapbox()
      .then(() => {
        if (this.mapContainer && isPlatformBrowser(this.platformId)) {
          this.mapService.initMap(this.mapContainer.nativeElement, this.mapCenter, this.mapZoom);
        }
      })
      .catch(error => this.errorHandlerService.handleError(error));
  }

  updateDistances() {
    if (this.packageDetails && this.deliveryDetails) {
      const distance = this.mapService.calculateDistance(
        this.packageDetails.from.location,
        this.deliveryDetails.location
      );
      this.mapService.updateDistanceMarker(distance);
    }
  }
}