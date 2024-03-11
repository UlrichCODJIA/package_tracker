import { Component, OnInit } from '@angular/core';
import { PackageTrackerService } from '../../shared/package-tracker.service';
import { RealTimeUpdatesService } from '../../shared/real-time-updates.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {
onMapReady($event: Event) {
throw new Error('Method not implemented.');
}
onMapClick($event: google.maps.MapMouseEvent|google.maps.IconMouseEvent) {
throw new Error('Method not implemented.');
}
  packageData: any;
  delivery: any;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markers: google.maps.Marker[] = [];
  polyline: google.maps.Polyline | null = null;
  map: any;
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

  updateMap(): void {
    this.clearMap();

    const packageMarker = new google.maps.Marker({
      position: this.packageData.from.location,
      map: this.map,
      title: 'Package Origin',
      icon: 'assets/icons/package.png'
    });
    this.markers.push(packageMarker);

    const destinationMarker = new google.maps.Marker({
      position: this.packageData.to.location,
      map: this.map,
      title: 'Package Destination',
      icon: 'assets/icons/destination.png'
    });
    this.markers.push(destinationMarker);

    if (this.delivery && this.delivery.location) {
      const deliveryMarker = new google.maps.Marker({
        position: this.delivery.location,
        map: this.map,
        title: 'Delivery Location',
        icon: 'assets/icons/delivery.png'
      });
      this.markers.push(deliveryMarker);

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(this.packageData.from.location);
      bounds.extend(this.packageData.to.location);
      bounds.extend(this.delivery.location);
      this.map.fitBounds(bounds);

      this.drawRoute();
    } else {
      this.center = this.packageData.from.location;
      this.map.setCenter(this.center);
      this.map.setZoom(10);
    }
  }

  drawRoute(): void {
    if (this.polyline) {
      this.polyline.setMap(null);
    }

    const path = [
      this.packageData.from.location,
      this.delivery.location,
      this.packageData.to.location
    ];

    this.polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    this.polyline.setMap(this.map);
  }

  clearMap(): void {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];

    if (this.polyline) {
      this.polyline.setMap(null);
      this.polyline = null;
    }
  }

  updateDelivery(delivery: any): void {
    this.delivery = delivery;
    this.updateMap();
  }

  getIconUrl(marker: google.maps.Marker): string {
    const icon = marker.getIcon();
    if (typeof icon === 'object' && icon && 'url' in icon) {
      return icon.url;
    }
    return '';
  }

  getMarkerScaledSize(): google.maps.Size {
    return new google.maps.Size(30, 30);
  }

}