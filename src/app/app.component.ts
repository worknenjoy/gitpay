import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    private authenticated = false;

    constructor(private router: Router) {}

    logout() {
      this.authenticated = false;
      this.router.navigate(['/signin']);
   }
 }
