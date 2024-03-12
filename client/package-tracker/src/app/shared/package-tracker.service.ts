import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { MapboxRouteResponse } from '../web-tracker/tracker/tracker.component'
@Injectable({
  providedIn: 'root'
})
export class PackageTrackerService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  public getPackages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/package`);
  }

  public getPackage(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/package/${id}`);
  }

  public createPackage(packageData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/package`, packageData);
  }

  public updatePackage(id: number, packageData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/package/${id}`, packageData);
  }

  public deletePackage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/package/${id}`);
  }

  public getDeliveries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/delivery`);
  }

  public getDelivery(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/delivery/${id}`);
  }

  public createDelivery(delivery: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/delivery`, delivery);
  }

  public updateDelivery(id: number, delivery: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/delivery/${id}`, delivery);
  }

  public deleteDelivery(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delivery/${id}`);
  }

  public getRoute(from: [number, number], to: [number, number]): Observable<any> {
    const mapboxDirectionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&overview=full&access_token=${environment.mapboxAccessToken}`;

    return this.http.get<MapboxRouteResponse>(mapboxDirectionsUrl).pipe(
      map(response => {
        if (response.routes && response.routes.length > 0) {
          return response.routes[0].geometry;
        }
        throw new Error('No route found');
      })
    );
  }
}