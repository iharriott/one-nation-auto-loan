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
    const apiAction = 'api/User/login';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.post<any>(this.endpoint, data);
  }

  getAllUsers(): Observable<any> {
    const apiAction = 'api/User/all';
    this.endpoint = `${this.baseUrl}/${apiAction}/${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.get<any>(this.endpoint);
  }

  getUser(userId: string, orgId: string): Observable<any> {
    const apiAction = 'api/User';
    this.endpoint = `${this.baseUrl}/${apiAction}/${userId}?orgId=${orgId}`;
    console.log(this.endpoint);
    return this.http.get<any>(this.endpoint);
  }

  signup(data: any): Observable<any> {
    console.log(data);
    const apiAction = 'api/User';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.post(this.endpoint, data);
  }

  updatePassword(data: any): Observable<any> {
    console.log(data);
    const apiAction = 'api/User/updatepassword';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.put(this.endpoint, data);
  }

  updateUserRoleOrganization(data: any): Observable<any> {
    console.log(`role data ${JSON.stringify(data)}`);
    const apiAction = 'api/User/role';
    this.endpoint = `${this.baseUrl}/${apiAction}`;
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
    this.setPayload(null);
    this.router.navigate(['login']);
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getfullnameFromToken() {
    if (this.userPayload) {
      return this.userPayload.unique_name;
    }
  }

  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }

  setPayload(payLoad: any) {
    this.userPayload = payLoad;
  }
}
