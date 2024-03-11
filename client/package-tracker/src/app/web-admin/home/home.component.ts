import { Component, OnInit } from '@angular/core';
import { PackageTrackerService } from '../../shared/package-tracker.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  packages: any[] = [];
  deliveries: any[] = [];

  constructor(private packageTrackerService: PackageTrackerService) { }

  ngOnInit(): void {
    this.fetchPackages();
    this.fetchDeliveries();
  }

  fetchPackages(): void {
    this.packageTrackerService.getPackages().subscribe(
      (packages) => {
        this.packages = packages;
      },
      (error) => {
        console.error('Error fetching packages:', error);
      }
    );
  }

  fetchDeliveries(): void {
    this.packageTrackerService.getDeliveries().subscribe(
      (deliveries) => {
        this.deliveries = deliveries;
      },
      (error) => {
        console.error('Error fetching deliveries:', error);
      }
    );
  }
}