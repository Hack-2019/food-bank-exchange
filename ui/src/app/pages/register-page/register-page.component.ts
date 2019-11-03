import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  username: string;
  password: string;

  already = false;
  err = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onSubmit() {
    const resp = await this.auth.createUser(this.username, this.password);
    
    if (resp === 'Created') {
      this.router.navigate(['']);
    } else if (resp === 'Username already exists') {
      this.already = true;
    } else {
      this.err = true;
    }
  }
}
