import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  public api_path: string;
  public api_vali_path: string;

  constructor(private http: HttpClient, private file: File, private transfer: FileTransfer) {
    this.api_path = 'http://dev.weela.com.br/api/v1/';
    //this.api_path_valitaxi = 'http://34.233.234.26/api/v1/';
    //this.api_vali_path = 'https://api.valipag.com.br/';
    //this.api_path = 'https://api.weela.com.br/api/v1/';
    //this.api_path = 'http://192.168.15.17:3000/api/v1/';
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers = headers.append('Authorization', localStorage.getItem('auth_token'));
    headers = headers.append('Content-type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    return headers;
  }

  get(url, data, avoid_auth?) {
    let headers = new HttpHeaders();
    console.log(url);
    if (!avoid_auth) headers = this.createAuthorizationHeader(headers);
    let params = null;
    if (data != null) {
      params = this.mountParams(data);
    }
    return this.http.get(this.api_path + url, { headers: headers, params: params }).pipe(
      map(this.extractData)
    );
  }

  post(url, data, avoid_auth?) {
    console.log(url);
    let headers = new HttpHeaders();
    if (!avoid_auth) headers = this.createAuthorizationHeader(headers);
    return this.http.post(this.api_path + url, data, {
      headers: headers
    }).pipe(
      map(this.extractData)
    );
  }

  put(url, data) {
    console.log(url);
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.patch(this.api_path + url, data, {
      headers: headers
    }).pipe(
      map(this.extractData)
    );
  }

  delete(url) {
    console.log(url);
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.delete(this.api_path + url, {
      headers: headers
    }).pipe(
      map(this.extractData)
    );
  }

  private extractData(res: any) {
    let body = res;
    console.log(body);
    return body || {};
  }

  private mountParams(filter) {
    let params = new HttpParams();
    for (let x in filter) {
      params = params.set(x, filter[x]);
    }
    return params;
  }

  public uploadImage(url, path, params): Observable<any> {
    return new Observable((observer) => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      let picture_name = path.split('/')[path.split('/').length - 1];
      if (!params) params = {};
      let format;
      if (picture_name.indexOf('?') != -1) picture_name = picture_name.substring(0, picture_name.lastIndexOf('?'));
      format = picture_name.substring(picture_name.lastIndexOf('.') + 1)
      params['fileName'] = picture_name;
      let headers = new HttpHeaders();
      this.createAuthorizationHeader(headers);
      let options = {
        fileKey: "file",
        fileName: picture_name,
        chunkedMode: false,
        params: params,
        mimeType: 'image/' + format,
        headers: headers,
      };
      fileTransfer.upload(path, this.api_path + url, options).then(data => {
        console.log(data);
        observer.next(data);
        observer.complete();
      }).catch(err => {
        console.log(err)
        observer.next(err);
        observer.complete();
      });
    });
  }
}
