// re-export for tester convenience
import { Product }        from '../products/product';
import { ProductService } from '../products/product.service';

export var PRODUCTS: Product[] = [
  new Product(1, 'product1', 'img1.png', 'lorem ipsum 1'),
  new Product(2, 'product2', 'img2.png', 'lorem ipsum 2'),
];

export class FakeProductService extends ProductService {

  products = PRODUCTS;
  lastPromise: Promise<any>;  // remember so we can spy on promise calls

  protected apiURL;
  protected imgURL;

  getAll(): Promise<Product[]> {

    return this.lastPromise = Promise.resolve<Product[]>(this.products);
  }

  getById(id: number) {
    let product = this.products.find(i => i.id === id);

    return product;
  }

  getByTitle(search: string) {
    let product = this.products.filter(i => { return (i['title'].indexOf(search) > -1) ? true : false; });

    return product;
  }
}
