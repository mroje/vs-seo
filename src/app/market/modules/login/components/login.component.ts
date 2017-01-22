import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from "../../../services/user.service";
import { isBrowser } from "angular2-universal";
import { Router } from "@angular/router";
import { GoogleAuthService } from "../services/google.auth.service";
import { FacebookAuthService } from "../services/facebook.auth.service";

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements AfterViewInit {
  public wrongEmailOrPassword: boolean;
  public credentials: any = {
    login: '',
    password: ''
  };

  @ViewChild('googleBtn') el: ElementRef;

  constructor(public User: UserService,
              public Router: Router,
              public GoogleAuth: GoogleAuthService,
              public FacebookAuth: FacebookAuthService) {
  }

  ngAfterViewInit() {
    if (isBrowser) {
      this.GoogleAuth.attachAuthOnElement(this.el.nativeElement)
        .subscribe(data => {
          this.User.socialLogin(data)
            .subscribe(this.onLoggedIn.bind(this))
        })
    }
  }

  fbAuth() {
    this.FacebookAuth.authenticate()
      .subscribe(data => {
        this.User.socialLogin(data)
          .subscribe(this.onLoggedIn.bind(this))
      })
  }

  submit() {
    this.User.login(this.credentials)
      .subscribe(this.onLoggedIn.bind(this));
  }

  public onLoggedIn({logged, twoFactorAuth}) {
    if (logged && !twoFactorAuth) {
        window.location.href = 'http://localhost:5555';
    } else if (twoFactorAuth) {
      this.Router.navigate(['/']);
      // this.$state.go('app.market.twoFa', {direct: true});
    }
  }
}
