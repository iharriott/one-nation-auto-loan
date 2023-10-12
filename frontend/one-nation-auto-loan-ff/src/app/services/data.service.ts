import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isapplicantExists!: boolean;
  primaryApplicant: any = null;
  currentEmployment: any = null;
  applicantName = '';
  isUserLoggedIn = false;
  user!: User | null;
  loginStatus$ = new BehaviorSubject<boolean>(false);
  applicantExist$ = new BehaviorSubject<boolean>(false);
  constructor(private snackBar: MatSnackBar) {}

  openSackBar(message: string, action: string) {
    this.snackBar.open(message, (action = 'ok'), {
      duration: 1000,
      verticalPosition: 'top',
    });
  }
}
