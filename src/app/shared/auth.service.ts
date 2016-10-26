import { Injectable }               from '@angular/core';
import { Http, Headers, Response }  from '@angular/http';
import { RequestOptions }           from '@angular/http';
import { Observable }               from 'rxjs/Observable';
import { Subject }                  from 'rxjs/Subject';

import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { baseURL } from './options';

@Injectable()
export class AuthService {
  private apiURL: string;

  private loggedIn: boolean = false;
  private authUser;

  private subject = new Subject<boolean>(); // notification stream for signin/signout events

  constructor(private http: Http) {
    this.apiURL   = baseURL + 'api/';
    this.authUser = JSON.parse(localStorage.getItem('currentUser')) || {};

    this.loggedIn = this.authUser && !!this.authUser.token;
    this.subject.next(this.loggedIn);
  }

  signIn(userdata): Observable<boolean> {
    let body    = JSON.stringify(userdata);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.apiURL}login/?format=json`, body, options)
      .map((res: Response) => {
        let data = res.json();
        if (data && data.success) { // login success
          this.authUser = { username: userdata.usermail, token: data.token };
          localStorage.setItem('currentUser', JSON.stringify(this.authUser));

          this.loggedIn = true;
          this.subject.next( this.loggedIn );

          return true;
        } else {
          throw new Error(data.message);
        }
      })
      .catch(this.handleError);
  }

  signUp(userdata): Observable<boolean> {
    let body    = JSON.stringify(userdata);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.apiURL}register/?format=json`, body, options)
      .map((res: Response) => {
        let data = res.json();
        if (data && data.success) { // register success
          this.authUser = { username: userdata.usermail, token: data.token };
          localStorage.setItem('currentUser', JSON.stringify(this.authUser));

          this.loggedIn = true;
          this.subject.next( this.loggedIn );

          return true;
        } else {
          throw new Error(data.message);
        }
      })
      .catch(this.handleError);
  }

  signOut(): void {
    localStorage.removeItem('currentUser');
    this.loggedIn = false;
    this.subject.next( this.loggedIn );
  }

  isLoggedIn() {
    return this.subject.asObservable();
  }

  getToken(): string {
    return this.authUser.token;
  }

  getUser(): string {
    return this.authUser;
  }

  updateStatus(): void {
    this.subject.next( this.loggedIn );
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
