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
  deliveryMarker: mapboxgl.Marker | null = null;
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
    if (this.deliveryMarker) {
      this.deliveryMarker.remove();
    }

    this.addMarker(this.delivery.location, 'assets/icons/delivery.png');
  }

  addRouteToMap(): void {
    if (this.route) {
      this.map.removeSource('route');
      this.map.removeLayer('route');
    }

    this.mapboxRoutingService
      .getRoute(
        [this.packageData.from.location.lng, this.packageData.from.location.lat],
        [this.delivery.location.lng, this.delivery.location.lat]
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
      this.deliveryMarker.remove();
      this.deliveryMarker = null;
    }
    if (this.route) {
      this.map.removeSource('route');
      this.map.removeLayer('route');
      this.route = null;
    }
  }

  watchLocation(): void {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const currentLocation: [number, number] = [position.coords.longitude, position.coords.latitude];

          if (this.currentLocation) {
            this.animateDeliveryMarker(this.currentLocation, currentLocation);
          }

          this.currentLocation = currentLocation;
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  animateDeliveryMarker(from: [number, number], to: [number, number]): void {
    if (this.deliveryMarker) {
      const fromLngLat = new mapboxgl.LngLat(from[0], from[1]);
      const toLngLat = new mapboxgl.LngLat(to[0], to[1]);

      this.deliveryMarker.setLngLat(fromLngLat);

      const animation = () => {
        const marker = this.deliveryMarker;
        const step = (toLngLat.lng - fromLngLat.lng) / 100;

        requestAnimationFrame(() => {
          if (!marker) {
            return;
          }

          const currentLngLat = marker.getLngLat();
          const newLngLat = new mapboxgl.LngLat(currentLngLat.lng + step, currentLngLat.lat);

          if (newLngLat.lng >= toLngLat.lng) {
            marker.setLngLat(toLngLat);
            this.updateDeliveryLocation(to);
            return;
          }

          marker.setLngLat(newLngLat);
          animation();
        });
      };

      animation();
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
      this.addRouteToMap();
    }
  }

  updateDelivery(delivery: any): void {
    this.delivery = delivery;
    this.updateMap();
  }

  changeStatus(newStatus: string): void {
    if (this.delivery) {
      this.realTimeUpdatesService.emitStatusChanged(this.delivery.delivery_id, newStatus);
    }
  }
}