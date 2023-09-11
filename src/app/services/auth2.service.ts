import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Device } from '@ionic-native/device';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService2 {

  private user = null;

  constructor(public client: HttpService, public platform: Platform, public device: Device) {
  }

  public login(params): Observable<any> {
    var _http = this.client;
    return new Observable(observer => {
      params = this.setDeviceInfo(params);
      _http.post('users/signin', params, true).subscribe(data => {
        if (data.result == 'success') {
          let user = JSON.parse(data.user);
          localStorage.setItem("auth_token", user.auth_token);
          observer.next({ result: 'success' });
          observer.complete();
        } else {
          observer.next({ result: 'error' });
          observer.complete();
        }
      }, error => {
        observer.next(false);
        observer.complete();
      });
    });
  }

  public create(params): Observable<any> {
    var _http = this.client;
    return new Observable(observer => {
      params = this.setDeviceInfo(params);
      params['user']['profile'] = 'PASSENGER';
      _http.post('users/register', params, true).subscribe(data => {
        if (data.result == 'success') {
          let user = JSON.parse(data.user);
          localStorage.setItem("auth_token", user.auth_token);
          observer.next({ result: 'success' });
          observer.complete();
        } else {
          observer.next(data);
          observer.complete();
        }
      }, error => {
        observer.next(false);
        observer.complete();
      });
    });
  }

  private setDeviceInfo(params) {
    params['uuid'] = this.device.uuid;
    params['model'] = this.device.model;
    params['platform'] = this.device.platform;
    params['version'] = this.device.version;
    params['device_token'] = localStorage.getItem('device_token');
    return params;
  }

  public logout(): Observable<boolean> {
    return new Observable(observer => {
      localStorage.setItem("auth_token", '');
      localStorage.setItem("device_token", '');
      this.user = null;
      observer.next(true);
      observer.complete();
    });
  }

  public getUser(): Observable<any> {
    return new Observable(observer => {
      this.client.get('users/info', null).subscribe(user => {
        if (user && typeof user['result'] != 'undefined' && user.result == 'error') {
          this.user = null;
          observer.next(null);
          observer.complete();
        } else {
          for (let att in user)
            if (att.indexOf('_url') != -1) {
              user[att.substr(0, att.length - 4)] = user[att];
              delete user[att];
            }
          this.user = user;
          observer.next(user);
          observer.complete();
        }
      }, err => {
        observer.next(null);
        observer.complete();
      });
    });
  }
}
