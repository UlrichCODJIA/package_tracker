import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PackageDetails } from './package-tracking/package-tracking.component';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private apiUrl = environment.packageAPIUrl;

  constructor(private http: HttpClient) {}

  getPackageById(packageId: string): Observable<PackageDetails> {
    return this.http.get<PackageDetails>(`${this.apiUrl}/packages/${packageId}`);
  }
}