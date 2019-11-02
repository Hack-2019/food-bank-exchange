import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = false;

  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public authenticate(username: string, password: string) {
    this.authenticated = true;
  }
}
