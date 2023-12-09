import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CommonConstants } from '../constants/common-constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint!: string;
  baseUrl = environment.userApiEndpoint;

  constructor(private router: Router, private http: HttpClient) {
    //debugger;
    this.userPayload = this.decodeToken();
    console.log(`decoded payllad ${this.userPayload}`);
  }
  private userPayload: any;

  login(data: any): Observable<any> {
    const apiAction = 'user/login';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.post<any>(this.endpoint, data);
  }

  register(data: any): Observable<any> {
    console.log(data);
    const apiAction = 'user';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.post(this.endpoint, data);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getfullnameFromToken() {
    if (this.userPayload) {
      return this.userPayload.name;
    }
  }

  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }
}
