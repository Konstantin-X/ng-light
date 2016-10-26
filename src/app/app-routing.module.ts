import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpComponent }        from './help/help.component';
import { ProductListComponent } from './products/product-list.component';
import { ProductInfoComponent } from './products/product-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products',    component: ProductListComponent },
  { path: 'product/:id', component: ProductInfoComponent },
  { path: 'help',        component: HelpComponent}
];

@NgModule({
  imports:   [ RouterModule.forRoot(routes) ],
  exports:   [ RouterModule ],
  providers: []
})
export class AppRoutingModule {}
