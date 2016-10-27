import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpComponent }        from './help/help.component';
import { ProductInfoComponent } from './products/product-info.component';

const routes: Routes = [
  { path: '',     component: ProductInfoComponent },
  { path: 'help', component: HelpComponent}
];

@NgModule({
  imports:   [ RouterModule.forRoot(routes) ],
  exports:   [ RouterModule ],
  providers: []
})
export class AppRoutingModule {}
