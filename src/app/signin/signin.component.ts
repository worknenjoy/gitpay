import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';
import { Inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';

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
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
  }

  onSignin() {
    this.authService.signIn(this.form.value)
                .subscribe(data => {
                    if (data) {
                      console.log(data)
                      this.authService.authenticated = true;
                    }else {
                      this.authService.authenticated = false;
                    }
                }, error => this.errorMessage = <any>error);
  }

  authenticated(): Observable<boolean> {
    if (this.authenticatedObs) {
      return this.authenticatedObs;
    }

    this.authenticatedObs = this.authService.auth()
      .map(data => {return data.authenticated});
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
          this.router.navigate(['/']);
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
