import { Injectable } from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import 'rxjs/add/operator/share'
const input = new QueueingSubject<string>();

@Injectable({
  providedIn: 'root',
})
export class ServerSocket {
  public messages: WebSocketSubject<any>;
  public connectionStatus: any;

  constructor() { }

  public connect() {
    let url = 'ws://34.233.234.26:8080/wsc/' + localStorage.getItem('auth_token');
    //let url = 'ws://192.168.15.17:3000/wsc/' + localStorage.getItem('auth_token');

    if (this.messages) {
      this.messages.complete();
      this.messages = null;
      this.connectionStatus = null;
    }
    this.messages = webSocket({
      url: url,
      openObserver: {
        next: () => {
          this.send(JSON.stringify({ "command": "subscribe", "identifier": "{\"channel\":\"TripChannel\"}" }));
        }
      }
    });
    return this.messages;
  }


  public connect2(channel, room?) {
    let input = new QueueingSubject<string>();
    let url = 'ws://34.233.234.26:8080/wsc/' + localStorage.getItem('auth_token');
    //let url = 'ws://192.168.15.27:3000/wsc/' + localStorage.getItem('auth_token');
    if (this.messages) {
      this.messages.complete();
      this.messages = null;
      this.connectionStatus = null;
    }

    this.messages = webSocket({
      url: url,
      openObserver: {
        next: () => {
          if (room) {
            this.send2(input, JSON.stringify({ "command": "subscribe", "identifier": "{\"channel\":\"" + channel + "\", \"room\":\"" + room + "\"}" }));
          } else {
            this.send2(input, JSON.stringify({ "command": "subscribe", "identifier": "{\"channel\":\"" + channel + "\"}" }));
          }
        }
      }
    });
    return this.messages;
  }

  public send(message): void {
    if (this.messages) {
      this.messages.next(message);
    }
  }

  public send2(input, message): void {
    if (input) {
      input.next(message);
    }
  }
}