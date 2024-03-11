import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { PackageTrackerService } from '../../shared/package-tracker.service';
import { RealTimeUpdatesService } from '../../shared/real-time-updates.service';
import { environment } from '../../../environments/environment.development';
import * as mapboxgl from 'mapbox-gl';


export interface MapboxRouteResponse {
  routes: Array<{
    geometry: {
      coordinates: number[][];
      type: string;
    };
  }>;
}
@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;

  packageData: any;
  delivery: any;
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  routeLayer: boolean = false;
  routeSource: boolean = false;
  public environment = environment;

  constructor(
    private packageTrackerService: PackageTrackerService,
    private realTimeUpdatesService: RealTimeUpdatesService
  ) { }

  ngOnInit(): void {
    this.realTimeUpdatesService.connect();
    this.realTimeUpdatesService.onDeliveryUpdated().subscribe((delivery) => {
      this.updateDelivery(delivery);
    });
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.mapElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 10,
      accessToken: environment.mapboxAccessToken
    });

    this.map.on('load', () => {
      this.loadIcon('assets/icons/delivery.png', 'assets/icons/delivery.png');
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


  trackPackage(packageId: string): void {
    this.packageTrackerService.getPackage(packageId).subscribe(
      (packageData) => {
        this.packageData = packageData;
        if (packageData.active_delivery_id) {
          this.packageTrackerService.getDelivery(packageData.active_delivery_id).subscribe(
            (delivery) => {
              this.delivery = delivery;
              this.updateMap();
            },
            (error) => {
              console.error('Error fetching delivery:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error fetching package:', error);
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
      .addTo(this.map);
    this.markers.push(marker);
    return marker;
  }


  updateMap(): void {
    if (this.packageData && this.delivery && this.mapElement) {
      this.clearMap();

      const packageMarker = new mapboxgl.Marker({
        color: 'green'
      })
        .setLngLat(this.packageData.from.location)
        .addTo(this.map);
      this.markers.push(packageMarker);

      const destinationMarker = new mapboxgl.Marker({
        color: 'red'
      })
        .setLngLat(this.packageData.to.location)
        .addTo(this.map);
      this.markers.push(destinationMarker);

      if (this.delivery && this.delivery.location) {
        this.addMarker(this.delivery.location, 'assets/icons/delivery.png');

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(this.packageData.from.location);
        bounds.extend(this.packageData.to.location);
        bounds.extend(this.delivery.location);
        this.map.fitBounds(bounds, { padding: 50 });

        const fromCoordinates: [number, number] = [this.packageData.from.location.lng, this.packageData.from.location.lat];
        const toCoordinates: [number, number] = [this.packageData.to.location.lng, this.packageData.to.location.lat];
        this.packageTrackerService.getRoute(fromCoordinates, toCoordinates).subscribe(
          routeGeometry => {
            this.drawRoute(routeGeometry);
          },
          error => {
            console.error('Error fetching route:', error);
          }
        );
      } else {
        this.map.setCenter(this.packageData.from.location);
        this.map.setZoom(10);
      }
    }
  }

  animateMarker(marker: mapboxgl.Marker, start: [number, number], end: [number, number]) {
    const startTime = performance.now();
    const duration = 2000;

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


  drawRoute(routeGeometry: any): void {
    if (this.map.getLayer('route') && this.routeSource) {
      if (this.map.getLayer('route')) this.map.removeLayer('route');;
      if (this.routeSource) this.map.removeSource('route');
      this.routeLayer = false;
      this.routeSource = false;
    }

    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: routeGeometry
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
        'line-color': '#007cbf',
        'line-width': 5,
      }
    });
  };

  clearMap(): void {
    for (const marker of this.markers) {
      marker.remove();
    }
    this.markers = [];

    if (this.routeLayer && this.routeSource) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
      this.routeLayer = false;
      this.routeSource = false;
    }
  }

  updateDelivery(delivery: any): void {
    const oldLocation = this.delivery?.location;
    this.delivery = delivery;
    this.updateMap();

    if (oldLocation && this.markers.length > 0) {
      const deliveryMarker = this.markers[this.markers.length - 1];
      this.animateMarker(deliveryMarker, [oldLocation.lng, oldLocation.lat], [delivery.location.lng, delivery.location.lat]);
    }
  }

}