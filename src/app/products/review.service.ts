import { Injectable}                from '@angular/core';
import { Http, Headers, Response }  from '@angular/http';
import { RequestOptions }           from '@angular/http';
import { Observable }               from 'rxjs/Observable';

import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { baseURL }        from '../shared/options';
import { Review }         from './review';

@Injectable()
export class ReviewService {
  private apiURL: string;

  private reviews: Review[];

  constructor(private http: Http) {

    this.apiURL = baseURL + 'api/';
  }

  getAll(): Promise<Review[]> {
      return this.http.get(`${this.apiURL}reviews/?format=json`)
        .delay(100)  //  emulate slow connection
        .toPromise()
        .then((response) => { let reviews =  response.json() as Review[];
                              return reviews;
        })
        .catch(this.handleError);
  }

  addReview(review): Observable<boolean> {
    let body    = JSON.stringify(review);
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.apiURL + 'reviews/', body, options)
      .map((res: Response) => {
        let data = res.json();
        if (data) { // post success
          return true;
        } else {
          throw new Error(data.message);
        }
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
