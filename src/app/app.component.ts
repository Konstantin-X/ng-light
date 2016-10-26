import { Component, OnInit }  from '@angular/core';

import { AuthService }        from './shared/auth.service';

declare var $:any;  //  for jQuery

@Component({
  selector:     'app-root',
  templateUrl:  './app.component.html',
  styleUrls:   ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string  = '[NG] Light-Review';

  public errorMsg: string;
  public loading:  boolean = false;
  public loggedIn: boolean = false;

  public authUser;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLogged => {
      this.loggedIn = isLogged;
      this.authUser = this.authService.getUser();
    });
    this.authService.updateStatus();
  }

  showSignin() {
    this.errorMsg = null;
    $('#modal-signin').modal('show');
  }

  showSignup() {
    this.errorMsg = null;
    $('#modal-signup').modal('show');
  }

  signIn(form:any) {
    this.loading = true;

    let userdata = {password:  form.value.password,
                    usermail:  form.value.usermail};
    this.authService.signIn(userdata)
      .subscribe((result) => {
        if (result) {
          $('#modal-signin').modal('hide');
        }
        this.loading = false;
      },
        error => {
          this.errorMsg = error;
          this.loading = false;
      });
  }

  signUp(form) {
    this.loading = true;

    let userdata = {password:  form.value.password,
                    username:  form.value.username,
                    usermail:  form.value.usermail,
                    userphone: form.value.userphone};
    this.authService.signUp(userdata)
      .subscribe((result) => {
          if (result) {
            $('#modal-signup').modal('hide');
          }
          this.loading = false;
        },
        error => {
          this.errorMsg = error;
          this.loading = false;
        });
  }

  signOut() {
    this.authService.signOut();
  }
}
