import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  username: string;
  password: string;
  incorrect = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['summary']);
    }
  }

  async onSubmit() {
    const success = await this.auth.authenticate(this.username, this.password );
    if (success) {
      this.router.navigate(['summary']);
    } else {
      this.incorrect = true;
    }
  }

  logout() {;
    this.auth.logout();
  }
}
