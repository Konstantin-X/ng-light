import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule }           from '@angular/http';

import { UPLOAD_DIRECTIVES }    from 'ng2-uploader';


import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { HelpComponent }        from './help/help.component';
import { ProductInfoComponent } from './products/product-info.component';
import { ProductListComponent } from './products/product-list.component';

import { AuthService }          from './shared/auth.service';
import { ProductService }       from './products/product.service';
import { ReviewService }        from './products/review.service';

@NgModule({
  declarations: [ AppComponent, HelpComponent, ProductInfoComponent, ProductListComponent, UPLOAD_DIRECTIVES ],
  imports:      [ BrowserModule, FormsModule, HttpModule, AppRoutingModule],
  providers:    [ AuthService, ProductService, ReviewService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
