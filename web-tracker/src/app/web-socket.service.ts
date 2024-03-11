import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: Socket;
  private messagesSubject: Subject<any>;
  public messages$: Observable<any>;
  public connectionClosed$: boolean = false;

  constructor() {
    this.messagesSubject = new Subject<any>();
    this.messages$ = this.messagesSubject.asObservable();
  }

  public connect(url: string = environment.webSocketUrl): void {
    this.socket = io(url);

    this.socket.on('message', (data) => {
      this.messagesSubject.next(data);
    });

    this.socket.on('disconnect', () => {
      this.connectionClosed$ = true;
      console.log('Socket.IO connection disconnected');
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public sendMessage(message: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', message);
    }
  }
}
