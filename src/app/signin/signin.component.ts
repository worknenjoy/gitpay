import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.class';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public model: User;
  private subscription: Subscription;
  private errorMessage: string;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.model = new User();
  }

  onSignin() {
        this.authService.signIn(this.model)
                .subscribe(data => {
                    if (data) {
                      this.authService.authenticated = true;
                    }else {
                      this.authService.authenticated = false;
                    }
                }, error => this.errorMessage = <any>error);
  }

}
