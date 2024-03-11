import { Component, OnInit } from '@angular/core';
import { PackageTrackerService } from '../../shared/package-tracker.service';
import { RealTimeUpdatesService } from '../../shared/real-time-updates.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {
  onMapReady($event: Event) {
    throw new Error('Method not implemented.');
  }
  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    throw new Error('Method not implemented.');
  }
  packageData: any;
  delivery: any;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markers: google.maps.Marker[] = [];
  currentLocation: google.maps.LatLng | null = null;
  watchId: number | null = null;
  map: any;

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
    } else {
      this.center = this.packageData.from.location;
      this.map.setCenter(this.center);
      this.map.setZoom(10);
    }
  }

  clearMap(): void {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }

  watchLocation(): void {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const currentLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          if (this.currentLocation) {
            this.updateDeliveryLocation(currentLocation);
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

  updateDeliveryLocation(newLocation: google.maps.LatLng): void {
    if (this.delivery) {
      const location = {
        lat: newLocation.lat(),
        lng: newLocation.lng()
      };
      this.realTimeUpdatesService.emitLocationChanged(this.delivery.delivery_id, location);
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