import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { Inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { BasicValidators } from './../shared/basic-validators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  form: FormGroup;
  error = false;
  errorMessage = '';
  authenticatedObs: Observable<boolean>;
  authServiceSub: Subscription;
  authSub: Subscription;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject('apiBase') private apiBase: string
  ) { }

  ngOnInit(): any {
    this.form = this.formBuilder.group({
        email: ['', [Validators.required, BasicValidators.email]],
        password: ['', Validators.required],
    });
  }

  onSignin() {
    this.authService.signIn(this.form.value)
                .subscribe(data => {
                    if (data.id) {
                      this.authService.authenticated = true;
                      this.router.navigate(['/page']);
                    }else {
                      this.authService.authenticated = false;
                    }
                }, error => {
                  this.errorMessage = <any>error;
                  alert(this.errorMessage);
                });
  }

  register() {
    this.router.navigate(['/register']);
  }

  authenticated(): Observable<boolean> {
    if (this.authenticatedObs) {
      return this.authenticatedObs;
    }

    this.authenticatedObs = this.authService.auth()
      .map(data => {
        console.log(data)
        return data.authenticated
      });

    return this.authenticatedObs;
  }

  openAuthWindow(provider: string) {

    const newWindow = window.open(`${this.apiBase}/authorize/${provider}`, 'name', 'height=585, width=770');
    if (window.focus) {
       newWindow.focus();
    }

    const source = Observable.interval(2000)
      .map(() => {
        this.authServiceSub = this.authenticated().subscribe(data => {
          if (data) {
          this.router.navigate(['/page']);
          newWindow.close();
        }
       });
    });

    if (this.authSub) {
      this.authSub.unsubscribe();
    }

    this.authSub = source.subscribe();

  }

}
