import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'food-bank-exchange';
  authenticated = false;
  authenticatedUser = '';
  
  constructor(private auth: AuthService) {
  }
  
  ngOnInit() {
    this.authenticated = this.auth.isAuthenticated();
    this.authenticatedUser = this.auth.getAuthenticatedUser();
    this.auth.authChange.subscribe(() => {
      this.authenticated = this.auth.isAuthenticated();
      this.authenticatedUser = this.auth.getAuthenticatedUser();
    });
  }
}
