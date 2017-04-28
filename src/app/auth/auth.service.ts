import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  public authenticated = false;

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  headers: any = new Headers({ 'Content-Type': 'application/json' });
  options: any = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) {}

  signIn(user) {
      return this.http.post('/signin', user, this.options)
                      .map(response => response.json());
  }

  isAuthenticated() {
        return this.authenticated;
  }
}