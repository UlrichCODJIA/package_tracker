import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MapboxRouteResponse } from '../web-driver/driver/driver.component';

@Injectable({
  providedIn: 'root'
})
export class MapboxRoutingService {
  private mapboxDirectionsUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving';

  constructor(private http: HttpClient) { }

  getRoute(from: [number, number], to: [number, number]): Observable<any> {
    const mapboxDirectionsUrl = `${this.mapboxDirectionsUrl}/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&overview=full&access_token=${environment.mapboxAccessToken}`;

    return this.http.get<MapboxRouteResponse>(mapboxDirectionsUrl).pipe(
      map((response) => {
        if (response.routes && response.routes.length > 0) {
          return response.routes[0].geometry;
        }
        throw new Error('No route found');
      })
    );
  }
}