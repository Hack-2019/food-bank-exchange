import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'food-bank-exchange';
  authenticated = false;
  authenticatedUser = '';
  
  constructor(private auth: AuthService, private router: Router) {
  }
  
  ngOnInit() {
    this.authenticated = this.auth.isAuthenticated();
    this.authenticatedUser = this.auth.getAuthenticatedUser();
    this.auth.authChange.subscribe(() => {
      this.authenticated = this.auth.isAuthenticated();
      this.authenticatedUser = this.auth.getAuthenticatedUser();
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }
}
