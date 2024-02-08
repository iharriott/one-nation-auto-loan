import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { CommonConstants } from '../constants/common-constants';
import { User } from '../interfaces/user';
import { Applicant } from '../interfaces/applicant';
import { Employment } from '../interfaces/employment';
import { Pinitem } from '../interfaces/pinitem';
import { PinnedApplicant } from '../interfaces/pinnedApplicants';
import { SearchParams } from '../interfaces/searchParams';
import { Note } from '../interfaces/note';
import { Mortgage } from '../interfaces/mortgage';
import { Vehicle } from '../interfaces/vehicle';
import { Affiliate } from '../interfaces/affiliate';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  endpoint!: string;
  baseUrl = environment.userApiEndpoint;
  // register(data: any): Observable<any> {
  //   console.log(data);
  //   const apiAction = 'user';
  //   this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
  //   console.log(this.endpoint);
  //   return this.http.post(this.endpoint, data);
  // }

  // login(data: any): Observable<any> {
  //   console.log(data);
  //   const apiAction = 'user/login';
  //   this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
  //   console.log(this.endpoint);
  //   return this.http.post<any>(this.endpoint, data);
  // }

  createApplicant(data: any, userId: string): Observable<Applicant> {
    console.log(data);
    const apiAction = 'applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&userId=${userId}`;
    console.log(this.endpoint);
    return this.http.post<Applicant>(this.endpoint, data);
  }

  updateApplicant(
    data: any,
    userId: string,
    orgId: string,
    id: string
  ): Observable<Applicant> {
    //debugger;
    console.log(data);
    const apiAction = 'applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?orgId=${orgId}&userId=${userId}`;
    console.log(this.endpoint);
    return this.http.put<Applicant>(this.endpoint, data);
  }

  updateNote(
    data: any,
    userId: string,
    appId: string,
    id: string
  ): Observable<Note> {
    //debugger;
    console.log(data);
    const apiAction = 'note';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?appId=${appId}&userId=${userId}`;
    console.log(this.endpoint);
    return this.http.put<Note>(this.endpoint, data);
  }

  updateEmployment(
    data: any,
    userId: string,
    appId: string,
    id: string
  ): Observable<Employment> {
    console.log(data);
    const apiAction = 'employment';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?appId=${appId}&userId=${userId}`;
    console.log(this.endpoint);
    return this.http.put<Employment>(this.endpoint, data);
  }

  updateMortgage(
    data: any,
    userId: string,
    appId: string,
    id: string
  ): Observable<Mortgage> {
    console.log(`mortgage update ${JSON.stringify(data)}`);
    debugger;
    const apiAction = 'mortgage';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?appId=${appId}&userId=${userId}`;
    console.log(this.endpoint);
    return this.http.put<Mortgage>(this.endpoint, data);
  }

  updateVehicle(
    data: any,
    userId: string,
    appId: string,
    id: string
  ): Observable<Vehicle> {
    //debugger;
    console.log(data);
    const apiAction = 'api/Vehicle';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?appId=${appId}&userId=${userId}`;
    console.log(this.endpoint);
    return this.http.put<Vehicle>(this.endpoint, data);
  }

  deleteApplicant(id: string, orgId: string): Observable<any> {
    const apiAction = 'applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}`;
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?orgId=${orgId}`;
    return this.http.delete<any>(this.endpoint);
  }

  updateApplicantAttribute(requestBody: any): Observable<any> {
    const apiAction = 'applicant/updateattribute';
    this.endpoint = `${this.baseUrl}/${apiAction}`;
    console.log(this.endpoint);
    console.log(`body ${JSON.stringify(requestBody)}`);
    return this.http.put<any>(this.endpoint, requestBody);
  }

  getAllApplicant(): Observable<Applicant[]> {
    const apiAction = 'applicant/all';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.get<Applicant[]>(this.endpoint);
  }

  getAllNewApplicant(user: string): Observable<Applicant[]> {
    const apiAction = 'applicant/new';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&user=${user}`;
    console.log(this.endpoint);
    return this.http.get<Applicant[]>(this.endpoint);
  }

  searchApplicant(searchParams: SearchParams): Observable<Applicant[]> {
    const apiAction = 'applicant/search';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}`;
    console.log(this.endpoint);
    return this.http.post<Applicant[]>(this.endpoint, searchParams);
  }

  getApplicantById(id: string, orgId: string): Observable<Applicant> {
    const apiAction = 'applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?orgId=${orgId}`;
    console.log(this.endpoint);
    return this.http.get<Applicant>(this.endpoint);
  }

  createEmployment(
    data: any,
    user: string,
    appId: string
  ): Observable<Employment> {
    console.log(data);
    const apiAction = 'employment';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&userId=${user}&appId=${appId}`;
    console.log(this.endpoint);
    return this.http.post<Employment>(this.endpoint, data);
  }

  createNote(data: any, user: string, appId: string): Observable<Note> {
    //debugger;
    console.log(data);
    const apiAction = 'note';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&userId=${user}&appId=${appId}`;
    console.log(this.endpoint);
    return this.http.post<Note>(this.endpoint, data);
  }

  createVehicle(data: any, user: string, appId: string): Observable<Vehicle> {
    //debugger;
    console.log(data);
    const apiAction = 'api/Vehicle';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&userId=${user}&appId=${appId}`;
    console.log(this.endpoint);
    return this.http.post<Vehicle>(this.endpoint, data);
  }

  createMortgage(data: any, user: string, appId: string): Observable<Mortgage> {
    console.log(data);
    const apiAction = 'mortgage';
    this.endpoint = `${this.baseUrl}/${apiAction}?orgId=${CommonConstants.organization}&userId=${user}&appId=${appId}`;
    console.log(this.endpoint);
    return this.http.post<Mortgage>(this.endpoint, data);
  }

  getOrganization(): Observable<any> {
    const baseUrl = environment.organizationApiEndpoint;
    const apiAction = 'organization';
    this.endpoint = `${baseUrl}/${apiAction}`;
    return this.http.get(this.endpoint);
  }

  getUserPinnedItems(userId: string): Observable<Pinitem[]> {
    const apiAction = 'pinitem/all';
    this.endpoint = `${this.baseUrl}/${apiAction}/?userId=${userId}`;
    return this.http.get<Pinitem[]>(this.endpoint);
  }

  getCurrentEmployment(appId: string): Observable<Employment> {
    const apiAction = 'employment/applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}/${appId}`;
    return this.http.get<Employment>(this.endpoint);
  }

  getCurrentNote(appId: string): Observable<Note> {
    const apiAction = 'note/applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}/${appId}`;
    return this.http.get<Note>(this.endpoint);
  }

  getCurrentMortgage(appId: string): Observable<Mortgage> {
    const apiAction = 'mortgage/applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}/${appId}`;
    return this.http.get<Mortgage>(this.endpoint);
  }

  getCurrentVehicle(appId: string): Observable<Vehicle> {
    const apiAction = 'api/Vehicle/applicant';
    this.endpoint = `${this.baseUrl}/${apiAction}/${appId}`;
    return this.http.get<Vehicle>(this.endpoint);
  }

  getAffiliateLeads(affId: string): Observable<Affiliate[]> {
    const apiAction = 'api/Affiliate/all';
    this.endpoint = `${this.baseUrl}/${apiAction}/${affId}`;
    return this.http.get<Affiliate[]>(this.endpoint);
  }

  getAffiliateLeadById(affId: string, id: string): Observable<Affiliate> {
    const apiAction = 'api/Affiliate';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?affId=${affId}`;
    return this.http.get<Affiliate>(this.endpoint);
  }

  updateAffiliateLead(
    affiliate: Affiliate,
    affId: string,
    id: string,
    userId: string
  ): Observable<Affiliate> {
    const apiAction = 'api/Affiliate';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?affId=${affId}&userId=${userId}`;
    return this.http.put<Affiliate>(this.endpoint, affiliate);
  }

  createAffiliateLead(
    affiliate: Affiliate,
    orgId: string,
    userId: string
  ): Observable<Affiliate> {
    const apiAction = 'api/Affiliate';
    this.endpoint = `${this.baseUrl}/${apiAction}/?orgId=${orgId}&userId=${userId}`;
    return this.http.post<Affiliate>(this.endpoint, affiliate);
  }

  deleteAffiliateLead(affId: string, id: string): Observable<boolean> {
    const apiAction = 'api/Affiliate';
    this.endpoint = `${this.baseUrl}/${apiAction}/${id}/?affId=${affId}`;
    return this.http.delete<boolean>(this.endpoint);
  }

  getRecentlyAccessedItems(
    userId: string,
    orgId: string
  ): Observable<PinnedApplicant[]> {
    const apiAction = 'pinitem/recentlyaccessed';
    this.endpoint = `${this.baseUrl}/${apiAction}/?userId=${userId}&orgId=${orgId}`;
    return this.http.get<PinnedApplicant[]>(this.endpoint);
  }

  createPinnedApplicant(data: any): Observable<Pinitem> {
    console.log(data);
    const apiAction = 'pinitem';
    this.endpoint = `${this.baseUrl}/${apiAction}`;
    console.log(this.endpoint);
    return this.http.post<Pinitem>(this.endpoint, data);
  }

  updatePinnedApplicant(data: Pinitem): Observable<Pinitem> {
    console.log(data);
    const apiAction = 'pinitem';
    this.endpoint = `${this.baseUrl}/${apiAction}`;
    console.log(this.endpoint);
    return this.http.put<Pinitem>(this.endpoint, data);
  }
}
