import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PackageTrackerService } from '../../shared/package-tracker.service';

export interface Package {
  package_id: number,
  active_delivery_id: string,
  description: string;
  weight: number,
  dimensions: {
    width: number,
    height: number,
    depth: number
  },
  from: {
    name: string,
    address: string,
    location: { lat: number, lng: number }
  },
  to: {
    name: string,
    address: string,
    location: { lat: number, lng: number }
  }
}

export interface Delivery {
  package_id: string;
  status: 'open' | 'in-transit' | 'delivered';
  location: {
    lat: number;
    lng: number;
  };
  pickup_time: string,
  start_time: string,
  end_time: string,
}
@Component({
  selector: 'app-create-delivery',
  templateUrl: './create-delivery.component.html',
  styleUrls: ['./create-delivery.component.scss']
})
export class CreateDeliveryComponent implements OnInit {
  deliveryForm: any;
  filteredPackages: any;
  showDriverMap = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private packageTrackerService: PackageTrackerService
  ) { }

  ngOnInit(): void {
    this.deliveryForm = this.fb.group({
      package_id: ['', Validators.required],
      location: this.fb.group({
        lat: [{ value: 0, disabled: true }, [Validators.required, Validators.min(-90), Validators.max(90)]],
        lng: [{ value: 0, disabled: true }, [Validators.required, Validators.min(-180), Validators.max(180)]]
      })
    });

    this.filteredPackages = this.deliveryForm.get('package_id').valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string) => this.filterPackages(value))
    );
  }

  filterPackages(value: string): Observable<Package[]> {
    return this.packageTrackerService.getPackages().pipe(
      map(packages => packages.filter((packageData: Package) =>
        packageData.package_id.toString().toLowerCase().includes(value.toString().toLowerCase()) ||
        packageData.description.toLowerCase().includes(value.toLowerCase())))
    );
  }

  selectDriverLocation(): void {
    this.showDriverMap = true;
  }

  onLocationSelected(location: { lat: number, lng: number }): void {
    this.deliveryForm.patchValue({
      location: {
        lat: location.lat,
        lng: location.lng
      }
    });
    this.showDriverMap = false;
  }

  createDelivery(): void {
    if (this.deliveryForm.valid) {
      const delivery: Delivery = this.deliveryForm.getRawValue();
      this.packageTrackerService.createDelivery(delivery).subscribe(
        response => {
          console.log('Delivery successfully created', response);
          this.router.navigate(['/admin']);
        },
        error => console.error('Error creating delivery:', error)
      );
    } else { }
  }
}
