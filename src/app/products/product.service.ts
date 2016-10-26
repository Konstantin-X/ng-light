import { Injectable}  from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { baseURL }        from '../shared/options';
import { Product }        from './product';

@Injectable()
export class ProductService {
  protected apiURL: string;
  protected imgURL: string;

  products: Product[];

  constructor(private http: Http) {
    this.apiURL = baseURL + 'api/';
    this.imgURL = baseURL + 'static/';
  }

  getAll(): Promise<Product[]> {
    if (this.products) {
      return Promise.resolve(this.products);
    } else {
      return this.http.get(this.apiURL + 'products/?format=json')
          .delay(1000)  //  emulate slow connection
          .toPromise()
          .then((response) => { this.products = response.json() as Product[];
                                this.products.forEach(item => { item.img = this.imgURL + item.img; });
                                return this.products; })
          .catch(this.handleError);
    }
  }

  getById(id: number): Product {
    let result:Product[] = this.products.filter(product => product.id == id);

    return result[0];
  }

  getByTitle(search: string): Product[] {
    let result:Product[] = this.products.filter(product => { return (product['title'].indexOf(search) > -1) ? true : false }); // search str in product title

    return result;
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }

}
