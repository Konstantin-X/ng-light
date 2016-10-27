import { Component }  from '@angular/core';

declare var $:any;  //  for jQuery

@Component({
  selector:     'app-root',
  templateUrl:  './app.component.html',
  styleUrls:   ['./app.component.scss']
})
export class AppComponent {
  public title: string  = '[NG] Light-Review';

  public errorMsg: string;
  public loading:  boolean = false;

  constructor() {}
}
