import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import { User } from './user.interface';

@Injectable()
export class AuthService {

  public authenticated = false;
  private authenticatedApi = this.apiBase + '/api/authenticated';

  public showNavBarEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  headers: any = new Headers({ 'Content-Type': 'application/json' });
  options: any = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http,
    private router: Router,
    @Inject('apiBase') private apiBase: string
  ) {}

  signIn(user: User) {
      return this.http.post('/signin', user, this.options)
                      .map(response => response.json());
  }

  logout() {
    this.authenticated = false;
    this.showNavBar(false);
    this.router.navigate(['/signin']);
  }

  isAuthenticated() {
        return this.authenticated;
  }

  auth() {
    return this.http.get(this.authenticatedApi, <RequestOptionsArgs> {withCredentials: true})
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  private showNavBar(ifShow: boolean) {
     this.showNavBarEmitter.emit(ifShow);
  }

  private handleError (error: Response) {
    return Observable.throw(error || 'Server Error');
  }

}