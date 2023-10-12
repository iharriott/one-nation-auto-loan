import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CommonConstants } from '../constants/common-constants';
import { User } from '../interfaces/user';
import { Applicant } from '../interfaces/applicant';
import { Employment } from '../interfaces/employment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private dataService: DataService) {}
  endpoint!: string;
  baseUrl = environment.userApiEndpoint;
  register(data: any): Observable<any> {
    console.log(data);
    const apiAction = 'user';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.post(this.endpoint, data);
  }

  login(data: any): Observable<User> {
    console.log(data);
    const apiAction = 'user/login';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.post<User>(this.endpoint, data);
  }

  createApplicant(data: any, userId: string): Observable<Applicant> {
    console.log(data);
    const apiAction = 'applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&userId=${userId}`;
    console.log(this.endpoint);
    return this.http.post<Applicant>(this.endpoint, data);
  }

  getAllApplicant(): Observable<Applicant[]> {
    const apiAction = 'applicant/all';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.get<Applicant[]>(this.endpoint);
  }

  createEmployment(data: any, user: User): Observable<Employment> {
    console.log(data);
    const apiAction = 'employment';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&userId=${user.sk}`;
    console.log(this.endpoint);
    return this.http.post<Employment>(this.endpoint, data);
  }

  test(data: string): Observable<any> {
    console.log(data);
    const baseUrl = environment.testendpoint;
    const apiAction = 'calculator';
    const apiAction2 = 'add';
    const val1 = 5;
    const val2 = 20;
    //this.endpoint = `${baseUrl}/${apiAction}?userId=c8a5bcd5-5aba-4227-9457-7158e1e66111`;
    //this.endpoint = `${baseUrl}`;
    this.endpoint = `${baseUrl}/${apiAction}/${apiAction2}/${val1}/${val2}`;
    console.log(this.endpoint);
    return this.http.get(this.endpoint);
  }

  testPost(data: any): Observable<any> {
    // data = { ...data, Id: 'c8a5bcd5-5aba-4227-9457-7158e1e66678' };
    //data = { Id: 1, FirstName: 'Ian', LastName: 'Harriott' };
    console.log(data);
    const baseUrl = environment.testendpoint;
    const apiAction = 'user';
    this.endpoint = `${baseUrl}/${apiAction}?orgId=bmw`;
    console.log(this.endpoint);
    return this.http.post(this.endpoint, data);
  }

  getOrganization(): Observable<any> {
    const baseUrl = environment.organizationApiEndpoint;
    const apiAction = 'organization';
    this.endpoint = `${baseUrl}/${apiAction}`;
    return this.http.get(this.endpoint);
  }
}
