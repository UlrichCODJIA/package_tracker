// delivery.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryDetails } from './package-tracking/package-tracking.component';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = environment.deliveryAPIUrl;

  constructor(private http: HttpClient) { }

  getDeliveryById(deliveryId: string): Observable<DeliveryDetails> {
    return this.http.get<DeliveryDetails>(`${this.apiUrl}/deliveries/${deliveryId}`);
  }
}