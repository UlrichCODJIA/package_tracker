import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { PackageTrackerService } from '../../shared/package-tracker.service';
import { RealTimeUpdatesService } from '../../shared/real-time-updates.service';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { MapboxRoutingService } from '../../shared/mapbox-routing.service';

export interface MapboxRouteResponse {
  routes: Array<{
    geometry: {
      coordinates: number[][];
      type: string;
    };
  }>;
}
@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  map!: mapboxgl.Map;
  packageData: any;
  delivery: any;
  markers: mapboxgl.Marker[] = [];
  currentLocation: [number, number] | null = null;
  watchId: number | null = null;
  deliveryMarker: boolean = false;
  route: any | null = null;

  constructor(
    private packageTrackerService: PackageTrackerService,
    private realTimeUpdatesService: RealTimeUpdatesService,
    private mapboxRoutingService: MapboxRoutingService
  ) { }

  ngOnInit(): void {
    this.realTimeUpdatesService.connect();
    this.realTimeUpdatesService.onDeliveryUpdated().subscribe((delivery) => {
      this.updateDelivery(delivery);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();

    this.map.on('load', () => {
      this.loadIcon('assets/icons/delivery.png', 'assets/icons/delivery.png');
    });
  }

  initMap(): void {
    this.map = new mapboxgl.Map({
      container: this.mapElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 10,
      accessToken: environment.mapboxAccessToken
    });
  }

  loadIcon(id: string, url: string): void {
    this.map.loadImage(url, (error, image) => {
      if (error) {
        console.error(`An error occurred while loading the icon: ${id}`, error);
        return;
      }

      if (image) {
        this.map.addImage(id, image);
      } else {
        console.error(`Failed to load image for icon: ${id}`);
      }
    });
  }

  loadDelivery(deliveryId: string): void {
    this.packageTrackerService.getDelivery(deliveryId).subscribe(
      (delivery) => {
        this.delivery = delivery;
        this.packageTrackerService.getPackage(delivery.package_id).subscribe(
          (packageData) => {
            this.packageData = packageData;
            this.updateMap();
            this.watchLocation();
          },
          (error) => {
            console.error('Error fetching package:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching delivery:', error);
      }
    );
  }

  createCustomMarker(iconId: string): HTMLElement {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = `url(${iconId})`;
    el.style.width = '41px';
    el.style.height = '41px';
    el.style.backgroundSize = '100%';
    return el;
  }

  addMarker(lngLat: mapboxgl.LngLatLike, iconId: string): mapboxgl.Marker {
    const el = this.createCustomMarker(iconId);
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(lngLat)
      .setPopup(new mapboxgl.Popup().setHTML('Your Location'))
      .addTo(this.map);
    this.markers.push(marker);
    this.deliveryMarker = true;
    return marker;
  }

  updateMap(): void {
    this.clearMap();

    const packageMarker = new mapboxgl.Marker({
      color: 'brown'
    })
      .setLngLat([this.packageData.from.location.lng, this.packageData.from.location.lat])
      .setPopup(new mapboxgl.Popup().setHTML('Package Origin'))
      .addTo(this.map);
    this.markers.push(packageMarker);

    const destinationMarker = new mapboxgl.Marker({
      color: 'green'
    })
      .setLngLat([this.packageData.to.location.lng, this.packageData.to.location.lat])
      .setPopup(new mapboxgl.Popup().setHTML('Package Destination'))
      .addTo(this.map);
    this.markers.push(destinationMarker);

    if (this.delivery && this.delivery.location) {
      this.createDeliveryMarker();
      this.addRouteToMap();

      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([this.packageData.from.location.lng, this.packageData.from.location.lat]);
      bounds.extend([this.packageData.to.location.lng, this.packageData.to.location.lat]);
      bounds.extend([this.delivery.location.lng, this.delivery.location.lat]);
      this.map.fitBounds(bounds, { padding: 50 });
    } else {
      this.map.setCenter([this.packageData.from.location.lng, this.packageData.from.location.lat]);
      this.map.setZoom(10);
    }
  }

  createDeliveryMarker(): void {
    this.addMarker(this.delivery.location, 'assets/icons/delivery.png');
  }

  addRouteToMap(): void {
    if (this.route) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    this.mapboxRoutingService
      .getRoute(
        [this.delivery.location.lng, this.delivery.location.lat],
        [this.packageData.to.location.lng, this.packageData.to.location.lat]
      )
      .subscribe((geometry) => {
        this.route = geometry;
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: this.route
          }
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#888',
            'line-width': 5
          }
        });
      });
  }

  clearMap(): void {
    for (const marker of this.markers) {
      marker.remove();
    }
    this.markers = [];
    if (this.deliveryMarker) {
      this.deliveryMarker = false;
    }
    if (this.route) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
      this.route = null;
    }
  }

  watchLocation(): void {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus: PermissionStatus) => {
        if (permissionStatus.state === 'granted') {
          this.watchId = navigator.geolocation.watchPosition(
            (position) => {
              const currentLocation: [number, number] = [position.coords.longitude, position.coords.latitude];

              if (this.currentLocation) {
                this.animateMarker(this.currentLocation, currentLocation);
              }
              this.updateDeliveryLocation(currentLocation);

              this.currentLocation = currentLocation;
            },
            (error) => {
              console.error('Error getting location:', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          console.error('Geolocation permission not granted');
        }
      })
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  animateMarker(start: [number, number], end: [number, number]) {
    if (this.deliveryMarker) {
      const startTime = performance.now();
      const duration = 5000;
      const marker = this.markers[this.markers.length - 1];

      const animate = (currentTime: number) => {
        const t = Math.min((currentTime - startTime) / duration, 1);
        const interpolated: [number, number] = [
          start[0] + (end[0] - start[0]) * t,
          start[1] + (end[1] - start[1]) * t
        ];
        marker.setLngLat(interpolated);
        if (t < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  updateDeliveryLocation(newLocation: [number, number]): void {
    if (this.delivery) {
      const location = {
        lat: newLocation[1],
        lng: newLocation[0]
      };
      this.realTimeUpdatesService.emitLocationChanged(this.delivery.delivery_id, location);
      this.delivery.location = location;
    }
  }

  updateDelivery(delivery: any): void {
    if (this.packageData) {
      this.delivery = delivery;
      this.updateMap();
    }
  }

  changeStatus(newStatus: string): void {
    if (this.delivery) {
      this.realTimeUpdatesService.emitStatusChanged(this.delivery.delivery_id, newStatus);
    }
  }
}