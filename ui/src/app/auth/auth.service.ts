import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = null;

  private authChangeEmitter = new EventEmitter();
  public authChange = this.authChangeEmitter.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.authenticated = window.localStorage.getItem('user');
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  public isAuthenticated(): boolean {
    return this.authenticated != null;
  }

  public checkAuth()  {
    this.http.get(`http://${environment.server}/register/isloggedin`, this.httpOptions).subscribe((resp: any) => {
      if (resp.isLoggedIn === false) {
        this.logout();
        this.router.navigate(['']);
      }
    });
  }

  public authenticate(username: string, password: string): Promise<boolean> {
    const body: { username: string; password: string; } = {username, password};

    return new Promise<boolean>((resolve, reject) => {
      this.http.post(`http://${environment.server}/login`, JSON.stringify(body), this.httpOptions).subscribe((resp) => {
        if ((resp as ResponseLogin).username) {
          this.authenticated = (resp as ResponseLogin).username;
          window.localStorage.setItem('user', (resp as ResponseLogin).username);
          this.authChangeEmitter.emit();
          resolve(true);
        } else {
          resolve(false);
        }
      },
      (err) => {
        resolve(false);
      });
    });
  }

  public getAuthenticatedUser(): string {
    return this.authenticated;
  }

  public logout() {
    this.authenticated = null;
    window.localStorage.removeItem('user');
    this.authChangeEmitter.emit();
  }

  public createUser(username: string, password: string): Promise<string> {
    const body: { username: string; password: string; } = {username, password};

    return new Promise<string>((resolve, reject) => {
    this.http.post(`http://${environment.server}/register`, JSON.stringify(body), this.httpOptions).subscribe((resp) => {
        if ((resp as ResponseLogin).username === username) {
          resolve('Created');
        } else if ((resp as ResponseCreate).message) {
          resolve((resp as ResponseCreate).message);
        } else {
          resolve(null);
        }
      },
      (err) => {
        if ((err as ResponseCreate).message) {
        resolve((err as ResponseCreate).message);
      } else {
        resolve(null);
      }
      });
    });
  }
}

class ResponseLogin {
  username: string;
}
class ResponseCreate {
  message: string;
}
