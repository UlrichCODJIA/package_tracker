// map.service.ts
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { environment } from '../environments/environment';
import { Subject, Observable } from 'rxjs';
import { Location, PackageDetails, DeliveryDetails } from './package-tracking/package-tracking.component';
import { PackageService } from './package.service';
import { DeliveryService } from './delivery.service';

interface MapboxGeoJSONSource extends mapboxgl.GeoJSONSource {
  lineMetrics?: boolean;
  buffer?: number;
  tolerance?: number;
}

interface MapboxLayer extends mapboxgl.Layer {
  layout?: mapboxgl.LineLayout;
  paint?: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map!: mapboxgl.Map;
  private markers: mapboxgl.Marker[] = [];
  private directionsSource: MapboxGeoJSONSource | null = null;
  private directionsLayer: MapboxLayer | null = null;
  private mapCenterUpdates$ = new Subject<Location>();
  private routeRefreshInterval = 20000;
  private routeTimeout?: number;
  private previousDistance: number = 0;
  private packageDetails: PackageDetails | null = null;
  private deliveryDetails: DeliveryDetails | null = null;

  constructor(
    private packageService: PackageService,
    private deliveryService: DeliveryService
  ) {}

  initMap(mapContainer: HTMLElement, center: Location, zoom: number) {
    this.map = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom: zoom,
      accessToken: environment.mapboxAccessToken
    });
    this.fetchPackageAndDeliveryDetails();
    this.drawRoute();
  }

  addMarker(position: Location, label: string, type: string): void {
    const el = document.createElement('div');
    el.className = `marker ${type}-marker`;
    el.setAttribute('aria-label', label);

    const marker = new mapboxgl.Marker(el)
      .setLngLat([position.lng, position.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<p>${label}</p>`))
      .addTo(this.map);

    this.markers.push(marker);
  }

  addMarkers(packageDetails: PackageDetails | null, deliveryDetails: DeliveryDetails | null) {
    this.clearMarkers();

    if (packageDetails) {
      this.addMarker(packageDetails.from.location, 'Origin', 'origin');
      this.addMarker(packageDetails.to.location, 'Destination', 'destination');
    }

    if (deliveryDetails) {
      const distanceMarker = this.addMarker(deliveryDetails.location, 'Current', 'current');
      this.updateDistanceMarker(0, distanceMarker);
    }
  }

  updateDistanceMarker(distance: number, marker?: mapboxgl.Marker) {
    if (marker && Math.abs(this.previousDistance - distance) > 0.1) {
      const currentMarkerPopup = marker.getPopup();
      currentMarkerPopup.setHTML(`<p>Distance from origin: ${distance.toFixed(2)} km</p>`);
      this.previousDistance = distance;
    }
  }

  calculateDistance(origin: Location, destination: Location): number {
    const originCoords = [origin.lng, origin.lat];
    const destinationCoords = [destination.lng, destination.lat];
    return turf.distance(originCoords, destinationCoords, { units: 'kilometers' });
  }

  updateMapCenter(location: Location) {
    this.map.flyTo({ center: [location.lng, location.lat] });
    this.mapCenterUpdates$.next(location);
  }

  get mapCenterUpdates$(): Observable<Location> {
    return this.mapCenterUpdates$.asObservable();
  }

  fetchPackageAndDeliveryDetails() {
    const packageId = 'YOUR_PACKAGE_ID'; // Replace with the actual package ID
    const deliveryId = 'YOUR_DELIVERY_ID'; // Replace with the actual delivery ID

    this.packageService.getPackageById(packageId).subscribe(
      packageData => {
        this.packageDetails = packageData;
        this.drawRoute();
      },
      error => {
        console.error('Error fetching package details:', error);
      }
    );

    this.deliveryService.getDeliveryById(deliveryId).subscribe(
      deliveryData => {
        this.deliveryDetails = deliveryData;
        this.drawRoute();
      },
      error => {
        console.error('Error fetching delivery details:', error);
      }
    );
  }

  drawRoute() {
    this.logger.info("directionsSource is:", this.directionsSource, "directionsLayer is: ", this.directionsLayer)
    if (this.directionsSource && this.directionsLayer) {
      if (
        this.packageDetails &&
        this.deliveryDetails &&
        this.directionsSourceData?.geometry.coordinates[0][0] === this.packageDetails.from.location.lng &&
        this.directionsSourceData?.geometry.coordinates[0][1] === this.packageDetails.from.location.lat &&
        this.directionsSourceData?.geometry.coordinates[this.directionsSourceData?.geometry.coordinates.length - 1][0] === this.deliveryDetails.location.lng &&
        this.directionsSourceData?.geometry.coordinates[this.directionsSourceData?.geometry.coordinates.length - 1][1] === this.deliveryDetails.location.lat
      ) {
        return;
      }

      this.map.removeLayer(this.directionsLayer.id);
      this.map.removeSource(this.directionsSource);
    }

    if (this.packageDetails && this.deliveryDetails) {
      const origin = [this.packageDetails.from.location.lng, this.packageDetails.from.location.lat];
      const destination = [this.deliveryDetails.location.lng, this.deliveryDetails.location.lat];

      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?geometries=geojson&access_token=${environment.mapboxAccessToken}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.directionsSource = new mapboxgl.GeoJSONSource({
            data: data,
            lineMetrics: true,
            buffer: 0,
            tolerance: 0.6
          });

          this.map.addSource('directions', this.directionsSource);

          this.directionsLayer = {
            id: 'directions-layer',
            type: 'line',
            source: 'directions',
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#3bb2d0',
              'line-width': 4
            }
          };

          if (this.directionsLayer) {
            this.map.addLayer(this.directionsLayer);
          }
        })
        .catch(error => {
          console.error('Error fetching directions:', error);
        });

      this.routeTimeout = setTimeout(() => {
        this.drawRoute();
      }, this.routeRefreshInterval) as unknown as number;
    }
  }
}