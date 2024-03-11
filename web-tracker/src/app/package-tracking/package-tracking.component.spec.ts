import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTrackingComponent } from './package-tracking.component';

describe('PackageTrackingComponent', () => {
  let component: PackageTrackingComponent;
  let fixture: ComponentFixture<PackageTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageTrackingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
