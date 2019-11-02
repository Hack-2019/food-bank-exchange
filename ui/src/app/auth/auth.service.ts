import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = null;

  private authChangeEmitter = new EventEmitter();
  public authChange = this.authChangeEmitter.asObservable();

  constructor(private http: HttpClient) {
    this.authenticated = window.localStorage.getItem('user');
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public isAuthenticated(): boolean {
    return this.authenticated != null;
  }

  public authenticate(username: string, password: string): Promise<boolean> {
    const body: { username: string; password: string; } = {username, password};

    return new Promise<boolean>((resolve, reject) => {
      this.http.post(`http://${environment.server}/login`, JSON.stringify(body), this.httpOptions).subscribe((resp) => {
        if ((resp as Response).username) {
          this.authenticated = (resp as Response).username;
          window.localStorage.setItem('user', (resp as Response).username);
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

  public createUser(username: string, password: string) {

  }
}

class Response {
  username: string;
}
