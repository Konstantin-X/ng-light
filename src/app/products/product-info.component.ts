import { Component, OnInit }      from '@angular/core';
import { EventEmitter, NgZone }   from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { NavigationEnd, Router }  from '@angular/router';

import { AuthService }            from "../shared/auth.service";
import { ProductService }         from './product.service';
import { ReviewService }          from "./review.service";

import { baseURL }                from '../shared/options';
import { Product }                from './product';
import { Review }                 from "./review";

@Component({
  styleUrls:   ['./product-info.component.scss'],
  templateUrl:  './product-info.component.html'
})
export class ProductInfoComponent implements OnInit {
  public errorMsg: string;
  public loading:  boolean = false;
  public loggedIn: boolean = false;

  protected uploadURL: string;
  protected imageURLbase: string;


  private zone: NgZone;
  public  options: Object;
  private progress: number = 0;
  private response: any = {};
  private previewUrl: string;

  private uploadEvents: EventEmitter<any> = new EventEmitter();

  private productId: number;
  private reviewImg: string;

  public product: Product;
  public reviews: Review[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private productService: ProductService,
    private reviewService:  ReviewService
  ) {

    this.uploadURL    = baseURL + 'api/upload/';
    this.imageURLbase = baseURL + 'uploads/';
  }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLogged => { this.loggedIn = isLogged;});
    this.authService.updateStatus();

    // get product ID from URL
    this.route.params.forEach((params: Params) => {
      this.productId = +params['id']; // evaluate to number
      this.loading = true;
      this.productService
        .getAll()
        .then(() => {this.getProduct(this.productId);})
        .then(() => {this.getReviews(this.productId);});

    });

    // on page navigation with "#"
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        let urlTree = this.router.parseUrl(this.router.url);
        if (urlTree.fragment) {
          let element = document.querySelector(`#${urlTree.fragment}`);
          if (element) { element.scrollIntoView({behavior: 'smooth'}); }
        }
      }
    });

    // file upload -->
    this.zone = new NgZone({ enableLongStackTrace: false });
    let token     = this.authService.getToken();

    this.options = {
      url: this.uploadURL
    };
  }

  handleUpload(data: any): void {
    this.zone.run(() => {
      this.response = data;
      if (data.response) {
        let res = JSON.parse(data.response);
        this.previewUrl = baseURL + res.previewUrl;
        this.reviewImg  = res.generatedName;
      }
      this.progress = Math.floor(data.progress.percent / 100);
    });
  }

  getProduct(id: number) {
    this.product = this.productService.getById(id);
  }

  getReviews(id: number) {
    this.reviewService
      .getAll(id)
      .then(data => {
        this.reviews = data;
        this.loading = false;
      });
  }

  addReview(form:any) {
    this.errorMsg = '';
    this.loading  = true;

    let token     = this.authService.getToken();
    let newReview = { rate:   form.value.rate,
                      text:   form.value.text,
                      images: [ this.reviewImg ] };
    this.reviewService.addReview(newReview, this.product.id, token)
      .subscribe((result) => {
          this.previewUrl = '';
          this.getReviews(this.productId);
          this.loading = false;
        },
        error => {
          this.errorMsg = 'Error: try it later!';
          this.loading = false;
        });
  }

  gotoProducts() {
    this.location.back();
  }
}
