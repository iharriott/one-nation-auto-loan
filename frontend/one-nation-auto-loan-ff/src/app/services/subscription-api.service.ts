import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CommonConstants } from '../constants/common-constants';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionApiService {
  constructor(private http: HttpClient) {}
  endpoint!: string;
  baseUrl = environment.userApiEndpoint;

  subscribe(email: string): Observable<any> {
    const apiAction = 'api/Sns/subscription';
    this.endpoint = `${this.baseUrl}/${apiAction}?email=${email}&subscriptionArn=${environment.emailSubscriptiontopicArn}`;
    console.log(this.endpoint);
    return this.http.get<any>(this.endpoint);
  }

  unsubscribe(email: string): Observable<any> {
    const apiAction = 'api/Sns/unsubscribe';
    this.endpoint = `${this.baseUrl}/${apiAction}?email=${email}&subscriptionArn=${environment.emailSubscriptiontopicArn}`;
    console.log(this.endpoint);
    return this.http.get<any>(this.endpoint);
  }
}
