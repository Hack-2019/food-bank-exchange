import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    return true;
  }
}
