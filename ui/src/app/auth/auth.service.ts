import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = null;

  constructor(private http: HttpClient) { }

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
          console.log('false');
          resolve(true);
        } else {
          console.log('false');
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

  public createUser(username: string, password: string) {

  }
}

class Response {
  username: string;
}
