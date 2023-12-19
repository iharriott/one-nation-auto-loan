import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user';
import { BehaviorSubject, catchError, forkJoin, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from './api.service';
import * as moment from 'moment';
import { Pinitem } from '../interfaces/pinitem';
import * as R from 'ramda';
import { CommonConstants } from '../constants/common-constants';
import { Applicant } from '../interfaces/applicant';
import { SearchParams } from '../interfaces/searchParams';
import { Employment } from '../interfaces/employment';
import { Mortgage } from '../interfaces/mortgage';
import { Note } from '../interfaces/note';
import { FormControl, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Vehicle } from '../interfaces/vehicle';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isapplicantExists!: boolean;
  primaryApplicant: any = null;
  currentApplicant!: Applicant;
  currentEmployment!: Employment | undefined;
  currentMortgage!: Mortgage | undefined;
  currentNote!: Note | undefined;
  currentVehicle!: Vehicle | undefined;
  applicantName = '';
  applicantPk = '';
  applicantSk = '';
  user!: User | null;
  isEditMode = false;
  loginStatus$ = new BehaviorSubject<boolean>(false);
  applicantExist$ = new BehaviorSubject<boolean>(false);
  editMode$ = new BehaviorSubject<boolean>(false);

  tableData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  pinnedData$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  recentlyAccessed$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  currentApplicant$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  currentNote$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  currentEmployment$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  currentMortgage$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  currentVehicle$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  data: any;
  rowData!: any[];
  pinnedApplicants!: any[];
  pinItemData!: Pinitem[];
  recentData!: any[];
  pinItemRecentlyCreated!: Pinitem;
  pinItemRecentlyUpdated!: Pinitem;
  searchParams!: SearchParams;
  isEditModeMortgage = signal(false);
  isEditModeEmployment = signal(false);
  isEditModeNote = signal(false);
  isEditModeApplicant = signal(false);
  isEditModeVehicle = signal(false);
  isEditModeAffiliate = signal(false);
  currentApplicantSignal = signal(this.currentApplicant);

  constructor(
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private toast: NgToastService
  ) {}

  openSackBar(message: string, action: string) {
    this.snackBar.open(message, (action = 'ok'), {
      duration: 1000,
      verticalPosition: 'top',
    });
  }

  getAllData(userId: string) {
    forkJoin({
      url1: this.apiService
        .getAllNewApplicant(userId)
        .pipe(catchError((err) => of(err.status))),
      url2: this.apiService
        .getUserPinnedItems(userId)
        .pipe(catchError((err) => of([]))),
      url3: this.apiService
        .getRecentlyAccessedItems(userId, CommonConstants.organization)
        .pipe(catchError((err) => of([]))),
    }).subscribe({
      next: (data) => {
        const rowData = data.url1?.map((data: any) => {
          if (data !== null && data !== undefined) {
            console.log(`new data ${JSON.stringify(data)}`);
            return this.mapRowItems(data);
          }
          return null;
        });

        const pred3 = R.whereEq({
          display: 'active',
        });

        //persits row data before active filter
        this.rowData = rowData;
        const searchData = R.filter((dataItem) => {
          return pred3(dataItem);
        }, rowData);

        this.pinItemData = data.url2;

        this.tableData$.next(searchData);

        const pinnRowData = data.url3?.map((data) => {
          if (data !== null && data !== undefined) {
            return this.mapRowItems(data);
          }
          return null;
        });

        //persits pinned applicants before active filter
        this.pinnedApplicants = pinnRowData;
        const pred = R.whereEq({
          pinStatus: 'Y',
          display: 'active',
        });

        const pred2 = R.whereEq({
          pinStatus: 'N',
          display: 'active',
        });

        const pinnedRecord: any = R.filter((pinnedDataItem) => {
          return pred(pinnedDataItem);
        }, pinnRowData);

        const recentlyAccessed: any = R.filter((pinnedDataItem) => {
          return pred2(pinnedDataItem);
        }, pinnRowData);

        console.log(`pin row ${JSON.stringify(pinnRowData)}`);
        this.pinnedData$.next(pinnedRecord);
        this.recentlyAccessed$.next(recentlyAccessed);
      },
    });
  }

  getPrimaryApplicantId() {
    const { sk } = this.primaryApplicant;
    if (sk !== null) {
      return sk;
    }
    return null;
  }

  getSearchData(userId: string, params: SearchParams) {
    let pred3: any;
    let filterOnStatus = false;
    let searchData: any;
    //const joinByType = R.innerJoin(R.flip(R.propEq('type')))

    forkJoin({
      url1: this.apiService
        .searchApplicant(params)
        .pipe(catchError((err) => of(err.status))),
      url2: this.apiService
        .getUserPinnedItems(userId)
        .pipe(catchError((err) => of([]))),
      url3: this.apiService
        .getRecentlyAccessedItems(userId, CommonConstants.organization)
        .pipe(catchError((err) => of([]))),
    }).subscribe({
      next: (data) => {
        const rowData = data.url1.map((data: any) => {
          console.log(`search data ${JSON.stringify(data)}`);
          if (data !== null && data !== undefined) {
            return this.mapRowItems(data);
          }
          return null;
        });

        if (
          params.display !== null &&
          params.display !== undefined &&
          params.display === 'inactive'
        ) {
          pred3 = R.whereEq({
            display: 'inactive',
          });
          filterOnStatus = true;
        } else if (
          params.display !== null &&
          params.display !== undefined &&
          params.display === 'active'
        ) {
          pred3 = R.whereEq({
            display: 'active',
          });
          filterOnStatus = true;
        }

        //persits row data before active filter
        this.rowData = rowData;
        if (filterOnStatus) {
          searchData = R.filter((dataItem) => {
            return pred3(dataItem);
          }, rowData);
        } else {
          searchData = rowData;
        }

        this.pinItemData = data.url2;
        const pinnRowData = data.url3?.map((data) => {
          if (data !== null && data !== undefined) {
            return this.mapRowItems(data);
          }
          return null;
        });

        const pred = R.whereEq({
          pinStatus: 'Y',
          display: 'active',
        });

        const pred2 = R.whereEq({
          pinStatus: 'N',
          display: 'active',
        });

        const pinnedRecord: any = R.filter((pinnedDataItem) => {
          return pred(pinnedDataItem);
        }, pinnRowData);

        const recentlyAccessed: any = R.filter((pinnedDataItem) => {
          return pred2(pinnedDataItem);
        }, pinnRowData);

        console.log(`pin row ${JSON.stringify(pinnRowData)}`);
        console.log(`recently row ${JSON.stringify(pinnRowData)}`);
        let resultInclude = searchData.filter(
          (x: any) => !pinnedRecord.find((y: any) => y.phone === x.phone)
        );
        resultInclude = searchData.filter(
          (x: any) => !recentlyAccessed.find((y: any) => y.phone === x.phone)
        );
        const recent = recentlyAccessed.filter(
          (x: any) => !pinnedRecord.find((y: any) => y.phone === x.phone)
        );

        // this.tableData$.next(searchData);
        this.tableData$.next(resultInclude);
        this.pinnedData$.next(pinnedRecord);
        // this.recentlyAccessed$.next(recentlyAccessed);
        this.recentlyAccessed$.next(recent);
        console.log(`result ${JSON.stringify(resultInclude)}`);
        console.log(`recent ${JSON.stringify(recent)}`);
        console.log(`pinnedrecord ${JSON.stringify(pinnedRecord)}`);
      },
      error: (err) => {
        console.log(err);
        this.openSackBar(err.statusText, 'ok');
        // this.getAllData(this.getLoggedInUserId());
        // this.getRowData();
      },
    });
  }

  getRowData() {
    const userId = this.getLoggedInUserId();
    let searchParams = this.getLocalStorageItem('searchData');
    if (searchParams !== null && searchParams !== undefined) {
      searchParams = JSON.parse(searchParams);
      this.getSearchData(userId, searchParams);
    } else {
      this.getAllData(userId);
    }
  }

  isSearchParamsEmpty(value: SearchParams) {
    let objectEmpty = true;
    Object.values(value).map((res: string) => {
      if (res?.length > 0) {
        objectEmpty = false;
      }
    });
    return objectEmpty;
  }

  getListData() {
    this.populateUserPinnedItems();
    this.apiService.getAllApplicant().subscribe({
      next: (result) => {
        this.data = result.map((res) => {
          return {
            pk: res.pk,
            sk: res.sk,
            gsI1PK: res.gsI1PK,
            gsI1SK: res.gsI1SK,
            fullName: `${res?.firstName} ${res?.lastName}`,
            city: res?.address[0]?.city,
            province: res?.address[0]?.province,
            phone: res?.phone,
            creditScore: res?.creditScore,
            display: res?.display,
            pinStatus: res?.pinStatus,
            accessedDate: res?.accessedDate,
            assigned: res?.tempDealerId != null ? res?.tempDealerId[0] : '',
            verifiedStatus: res?.status,
            dealStatus: res?.dealStatus,
            dateCompleted: moment(res?.completedDate).format('MM/DD/YYYY'),
            dateAssigned: moment(res?.assignedDate).format('MM/DD/YYYY'),
          };
        });
        const updatePinData = this.setApplicantPinnedStatus(
          this.data,
          this.pinItemData
        );
        const segmentedData = this.getAccountPinnedStatus(updatePinData);
        console.log(`segmented data ${JSON.stringify(segmentedData)}`);
        this.tableData$.next(this.data);
        console.log(`List data ${JSON.stringify(this.data)}`);
      },
      error: console.log,
    });
  }

  getNewListData() {
    this.populateUserPinnedItems();
    this.apiService.getAllNewApplicant('user').subscribe({
      next: (result) => {
        this.data = result.map((res) => {
          return {
            pk: res.pk,
            sk: res.sk,
            gsI1PK: res.gsI1PK,
            gsI1SK: res.gsI1SK,
            fullName: `${res.firstName} ${res.lastName}`,
            city: res?.address[0]?.city,
            province: res?.address[0]?.province,
            phone: res.phone,
            creditScore: res.creditScore,
            display: res.display,
            assigned: res?.tempDealerId != null ? res?.tempDealerId[0] : '',
            verifiedStatus: res.status,
            dealStatus: res.dealStatus,
            dateCompleted: moment(res.completedDate).format('MM/DD/YYYY'),
            dateAssigned: moment(res.assignedDate).format('MM/DD/YYYY'),
          };
        });
        // const updatePinData = this.setApplicantPinnedStatus(
        //   this.data,
        //   this.pinItemData
        // );
        // const segmentedData = this.getAccountPinnedStatus(updatePinData);
        // console.log(`segmented data ${JSON.stringify(segmentedData)}`);
        this.tableData$.next(this.data);
        console.log(`List data ${JSON.stringify(this.data)}`);
      },
      error: console.log,
    });
  }

  populateUserPinnedItems() {
    const user = this.getLoggedInUser();
    const { sk } = user;
    this.apiService.getUserPinnedItems(sk).subscribe({
      next: (data) => {
        this.pinItemData = data;
        console.log(`pinned items ${JSON.stringify(data)}`);
      },
      error: console.log,
    });
  }

  setApplicantPinnedStatus(searchData: any, pinnedData: any) {
    let result;
    if (searchData !== undefined && pinnedData !== undefined) {
      result = R.map((data) => {
        const { sk } = data;
        const userId = this.getLoggedInUserId();
        const pred = R.whereEq({
          pk: userId,
          sk,
        });

        const pinnedRecord: any = R.find((pinnedDataItem) => {
          return pred(pinnedDataItem);
        }, pinnedData);

        if (pinnedRecord !== undefined) {
          const { pinStatus } = pinnedRecord;
          return { ...data, pinnedStatus: pinStatus };
        }
        return { ...data, pinnedStatus: 'N' };
      }, searchData);
    }

    return result;
  }

  getAccountPinnedStatus(data: any) {
    const pred = R.whereEq({
      pinStatus: 'Y',
    });

    const pred2 = R.whereEq({
      pinStatus: 'N',
    });

    const pinnedClients = R.filter((pinnedDataItem) => {
      return pred(pinnedDataItem);
    }, data);

    const unPinnedClients = R.filter((pinnedDataItem) => {
      return pred2(pinnedDataItem);
    }, data);

    //const pinnedClients = R.filter((applicant: any) => applicant?.pinnedStatus : "Y", data);
    //const unPinnedClients = R.filter((client) => !client?.pinnedStatus, data);
    return {
      searchData: [...data],
      pinnedClients,
      unPinnedClients,
    };
  }

  getLoggedInUser(): User {
    let user: User;
    let userString = this.getLocalStorageItem('userData');
    if (userString != undefined) {
      user = JSON.parse(userString);
      return user;
    }
    return null!;
  }

  getLoggedInUserId(): string {
    let user: User;
    let userString = this.getLocalStorageItem('userData');
    if (userString != undefined) {
      user = JSON.parse(userString);
      const { sk } = user;
      return sk;
    }
    return null!;
  }

  updateAttribute(currentApplicant: any, user: User, atType: string) {
    if (currentApplicant != undefined && user != undefined) {
      const { pk, sk } = currentApplicant;
      const orgId: string = pk;
      const applId: string = sk;
      const userId = user.sk;
      const attrType = atType;
      const requestBody = { orgId, applId, userId, attrType };
      if (orgId.length > 0 && applId.length > 0) {
        this.apiService.updateApplicantAttribute(requestBody).subscribe({
          next: (data) => this.getNewListData(),
          error: console.log,
        });
      }
    } else {
      this.openSackBar('Unable to Update User', 'ok');
    }
  }

  removeLocalStorageItem(name: string) {
    window.localStorage.removeItem(name);
  }

  setLocalStorageItem(name: string, data: any) {
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  getLocalStorageItem(name: string): any {
    return window.localStorage.getItem(name);
  }

  getPrimaryApplicant() {
    const { fullName } = this.primaryApplicant;
    const { firstName, lastName } = this.primaryApplicant;

    return fullName !== null ? fullName : `${firstName} ${lastName}`;
  }

  isApplicantPinned(applId: string, userId: string): boolean {
    const pinnedClient = this.getPinnedApplicant(applId, userId);

    if (pinnedClient != undefined) {
      return true;
    }
    return false;
  }

  getPinnedApplicant(applId: string, userId: string): Pinitem | undefined {
    if (applId != undefined && userId != undefined) {
      const pred = R.whereEq({
        pk: userId,
        sk: applId,
      });

      const pinnedClient = R.find((pinnedDataItem) => {
        return pred(pinnedDataItem);
      }, this.pinItemData);
      if (pinnedClient != null) {
        return pinnedClient;
      }
      return undefined;
    }
    return undefined;
  }

  mapRowItems(res: Applicant) {
    console.log(`applicant in map ${JSON.stringify(res)}`);
    return {
      pk: res.pk,
      sk: res.sk,
      gsI1PK: res.gsI1PK,
      gsI1SK: res.gsI1SK,
      fullName: `${res.firstName} ${res.lastName}`,
      city: res?.address[0]?.city,
      province: res?.address[0]?.province,
      phone: res?.phone,
      creditScore: res?.creditScore,
      pinStatus: res?.pinStatus,
      accessedDate: res?.accessedDate,
      display: res?.display,
      assigned: res?.tempDealerId != null ? res?.tempDealerId[0] : '',
      verifiedStatus: res?.status,
      dealStatus: res?.dealStatus,
      dateCompleted: moment(res?.completedDate).format('MM/DD/YYYY'),
      dateAssigned: moment(res?.assignedDate).format('MM/DD/YYYY'),
    };
  }

  getApplicantData() {
    const pk = this.applicantPk;
    const sk = this.applicantSk;
    if (pk.length > 0 && sk.length > 0) {
      forkJoin({
        url1: this.apiService
          .getApplicantById(sk, pk)
          .pipe(catchError((err) => of(err.status))),
        url2: this.apiService
          .getCurrentEmployment(sk)
          .pipe(catchError((err) => of(undefined))),
        url3: this.apiService
          .getCurrentNote(sk)
          .pipe(catchError((err) => of(undefined))),
        url4: this.apiService
          .getCurrentMortgage(sk)
          .pipe(catchError((err) => of(undefined))),
        url5: this.apiService
          .getCurrentVehicle(sk)
          .pipe(catchError((err) => of(undefined))),
      }).subscribe({
        next: (data) => {
          this.currentApplicant = data.url1;
          this.currentApplicant$.next(this.currentApplicant);
          // this.formData = data.url1;
          // const { address, ...otherFormdata } = data.url1;
          // this.applicantForm.patchValue(otherFormdata);
          // if (address?.length > 0) {
          //   this.setAddresses(address);
          // }
          this.applicantExist$.next(true);
          this.editMode$.next(true);
          this.currentEmployment = data.url2;
          this.currentEmployment$.next(this.currentEmployment);
          this.currentEmployment === undefined
            ? this.isEditModeEmployment.set(false)
            : this.isEditModeEmployment.set(true);
          console.log(`EMPLOYMENT ${JSON.stringify(this.currentEmployment)}`);
          (this.currentNote = data.url3),
            this.currentNote$.next(this.currentNote);
          console.log(`NOTE ${JSON.stringify(this.currentNote)}`);
          this.currentNote === undefined
            ? this.isEditModeNote.set(false)
            : this.isEditModeNote.set(true);
          this.currentMortgage = data.url4;
          this.currentMortgage$.next(this.currentMortgage);
          this.currentMortgage === undefined
            ? this.isEditModeMortgage.set(false)
            : this.isEditModeMortgage.set(true);
          this.currentVehicle = data.url5;
          this.currentVehicle$.next(this.currentVehicle);
          this.currentVehicle === undefined
            ? this.isEditModeVehicle.set(false)
            : this.isEditModeVehicle.set(true);
          console.log(`VEHICLE ${JSON.stringify(this.currentVehicle)}`);
        },
        error: console.log,
      });
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  clearLocalStorage() {
    localStorage.clear();
  }

  showSucess(message: string) {
    this.toast.success({ detail: 'SUCCESS', summary: message, duration: 5000 });
  }

  showError(message: string) {
    this.toast.error({ detail: 'ERROR', summary: message, sticky: true });
  }

  showInfo(message: string) {
    this.toast.info({ detail: 'INFO', summary: message, sticky: true });
  }
}
