import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageTrackerService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  public getPackages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/package`);
  }

  public getPackage(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/package/${id}`);
  }

  public createPackage(packageData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/package`, packageData);
  }

  public updatePackage(id: string, packageData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/package/${id}`, packageData);
  }

  public deletePackage(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/package/${id}`);
  }

  public getDeliveries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/delivery`);
  }

  public getDelivery(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/delivery/${id}`);
  }

  public createDelivery(delivery: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/delivery`, delivery);
  }

  public updateDelivery(id: string, delivery: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/delivery/${id}`, delivery);
  }

  public deleteDelivery(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delivery/${id}`);
  }
}