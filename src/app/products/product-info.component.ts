import { Component, OnInit }      from '@angular/core';
import { EventEmitter, NgZone }   from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { NavigationEnd, Router }  from '@angular/router';

import { ReviewService }          from "./review.service";

import { baseURL }                from '../shared/options';
import { Review }                 from "./review";

@Component({
  styleUrls:   ['./product-info.component.scss'],
  templateUrl:  './product-info.component.html'
})
export class ProductInfoComponent implements OnInit {
  public errorMsg: string;
  public loading:  boolean = false;

  protected uploadURL: string;
  protected imageURLbase: string;


  private zone: NgZone;
  public  options: Object;
  private progress: number = 0;
  private response: any = {};
  private previewUrl: string;

  private uploadEvents: EventEmitter<any> = new EventEmitter();

  private reviewImg: string = '';

  public reviews: Review[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private reviewService:  ReviewService
  ) {

    this.uploadURL    = baseURL + 'api/upload/';
    this.imageURLbase = baseURL + 'uploads/';
  }

  ngOnInit() {
    this.getReviews();

    // file upload -->
    this.zone = new NgZone({ enableLongStackTrace: false });

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

  getReviews() {
    this.loading = true;
    this.reviewService
      .getAll()
      .then(data => {
        this.reviews = data;
        this.loading = false;
      });
  }

  addReview(form:any) {
    let newReview = { usermail:  form.value.usermail,
                      username:  form.value.username,
                      userphone: form.value.userphone,
                      text:      form.value.text,
                      images:    [ this.reviewImg ] };

    let emailRegexp = /^[a-z0-9]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!emailRegexp.test(newReview.usermail)) {
      this.errorMsg = 'Error: Incorrect email format';
      return false;
    }

    this.errorMsg = '';
    this.loading  = true;

    this.reviewService.addReview(newReview)
      .subscribe((result) => {
          this.previewUrl = '';
          this.reviewImg  = '';
          this.getReviews();
          this.loading = false;
        },
        error => {
          this.errorMsg = error;
          this.loading  = false;
        });
  }
}
