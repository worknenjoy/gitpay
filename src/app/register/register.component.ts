import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { BasicValidators } from './../shared/basic-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  error = false;
  errorMessage = '';
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): any {
    this.form = this.formBuilder.group({
        email: ['', [Validators.required, BasicValidators.email]],
        password: ['', Validators.required],
    });
  }

  onRegister() {
    this.authService.register(this.form.value)
                .subscribe(data => {
                    if (data) {
                      this.router.navigate(['/signin']);
                    }
                }, error => {
                  this.errorMessage = <any>error;
                  alert(this.errorMessage);
                });
  }

}
