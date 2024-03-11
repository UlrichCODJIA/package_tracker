import { Component, OnInit } from '@angular/core';
import { PackageTrackerService } from '../../shared/package-tracker.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss']
})
export class CreatePackageComponent implements OnInit {
  packageData: any = {
    package_id: '',
    description: '',
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0
    },
    from: {
      name: '',
      address: '',
      location: {
        lat: 0,
        lng: 0
      }
    },
    to: {
      name: '',
      address: '',
      location: {
        lat: 0,
        lng: 0
      }
    }
  };

  constructor(
    private packageTrackerService: PackageTrackerService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  createPackage(): void {
    this.packageTrackerService.createPackage(this.packageData).subscribe(
      (newPackage) => {
        console.log('Package created:', newPackage);
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error('Error creating package:', error);
      }
    );
  }
}