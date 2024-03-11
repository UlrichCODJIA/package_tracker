import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class RealTimeUpdatesService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000');
  }

  public connect(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('connect', () => {
        observer.next();
      });
    });
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public onLocationChanged(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('location_changed', (data) => {
        observer.next(data);
      });
    });
  }

  public onStatusChanged(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('status_changed', (data) => {
        observer.next(data);
      });
    });
  }

  public onDeliveryUpdated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('delivery_updated', (data) => {
        observer.next(data);
      });
    });
  }

  public emitLocationChanged(deliveryId: string, newLocation: any): void {
    this.socket.emit('location_changed', { delivery_id: deliveryId, newLocation });
  }

  public emitStatusChanged(deliveryId: string, newStatus: string): void {
    this.socket.emit('status_changed', { delivery_id: deliveryId, newStatus });
  }
}