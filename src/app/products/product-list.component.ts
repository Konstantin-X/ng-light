import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService }         from './product.service';
import { Product }                from './product';

@Component({
  styleUrls:   ['./product-list.component.scss'],
  templateUrl:  './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  public loading: boolean = false;
  public products: Product[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit() { this.getProducts(); }

  getProducts() {
    this.loading = true;

    this.productService
        .getAll()
        .then(data => {
            this.products = data;
            this.loading = false;
        });
  }

  onSelect(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  onKey(event: any) {  // search filter handler
    let search = event.target.value;
    this.products = this.productService.getByTitle(search);
  }
}
