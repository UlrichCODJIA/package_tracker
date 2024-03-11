import { Component, OnInit } from '@angular/core';
import { PackageTrackerService } from '../../shared/package-tracker.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-delivery',
  templateUrl: './create-delivery.component.html',
  styleUrls: ['./create-delivery.component.scss']
})

export class CreateDeliveryComponent implements OnInit {
  delivery: any = {
    delivery_id: '',
    package_id: '',
    status: 'open',
    location: {
      lat: 0,
      lng: 0
    }
  };
  packages: any[] = [];
  filteredPackages: Observable<any[]>;

  constructor(
    private packageTrackerService: PackageTrackerService,
    private router: Router
  ) {
    this.filteredPackages = new Observable<any[]>();
  }

  ngOnInit(): void {
    this.fetchPackages();
  }

  displayPackage(packageData: any): string {
    return `${packageData.package_id} - ${packageData.description}`;
  }

  fetchPackages(): void {
    this.packageTrackerService.getPackages().subscribe(
      (packages) => {
        this.packages = packages;
        this.filteredPackages = this.filterPackages('');
      },
      (error) => {
        console.error('Error fetching packages:', error);
      }
    );
  }

  filterPackages(value: string): Observable<any[]> {
    const filterValue = value.toLowerCase();
    return new Observable<any[]>((observer) => {
      const filteredPackages = this.packages.filter((p: any) =>
        p.package_id.toLowerCase().includes(filterValue) ||
        p.description.toLowerCase().includes(filterValue)
      );
      observer.next(filteredPackages);
    });
  }

  createDelivery(): void {
    this.packageTrackerService.createDelivery(this.delivery).subscribe(
      (newDelivery) => {
        console.log('Delivery created:', newDelivery);
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error('Error creating delivery:', error);
      }
    );
  }
}