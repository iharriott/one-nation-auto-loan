import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loginForm!: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 5;
  errorMessage!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private _snackBar: MatSnackBar,
    private dataService: DataService
  ) {
    this.form = this.formBuilder.group({
      lastName: '',
      firstName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      userName: '',
    });

    this.loginForm = this.formBuilder.group({
      email: '',
      password: '',
    });
  }
  ngOnDestroy(): void {}

  isUserSignedUp = true;
  isUserLoggedIn!: boolean;
  isSpinnerStarted = false;
  isPasswordInvalid = false;
  isRegistrationSpinnerStarted = false;

  ngOnInit(): void {
    //this.isUserLoggedIn = this.dataService.isUserLoggedIn;

    this.dataService.loginStatus$.subscribe((data) => {
      this.isUserLoggedIn = data;
    });
  }

  register(): void {
    const formValues = this.form.getRawValue();
    this.isRegistrationSpinnerStarted = true;
    console.log(this.form.getRawValue());
    this.api.register(formValues).subscribe({
      next: (data) => {
        this.isRegistrationSpinnerStarted = false;
        this.dataService.openSackBar('Registered Successfully', 'Ok');
        console.log(data);
      },
      error: (error) => console.log(error),
    });
    // this.api.register(formValues).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //   },
    //   error: (error) => console.log(error),
    //   complete: () => console.log(`user created successfully`),
    // });

    // this.api.getOrganization().subscribe({
    //   next: (data) => {
    //     console.log(data);
    //   },
    //   error: (error) => console.log(error),
    //   complete: () => console.log(`organization retrieved successfully`),
    // });
  }

  login() {
    const formValues = this.loginForm.getRawValue();
    this.isSpinnerStarted = true;
    console.log(this.form.getRawValue());
    this.api.login(formValues).subscribe({
      next: (data) => {
        console.log(JSON.stringify(data));
        this.dataService.setLocalStorageItem('userData', data);
        //window.localStorage.setItem('userData', JSON.stringify(data));
        this.isSpinnerStarted = false;
        this.dataService.user = data;
        console.log(`data service user ${this.dataService.user}`);
        this.dataService.loginStatus$.next(true);
        this.dataService.openSackBar('Logged In Successfully', 'Ok');
        //this.openSnackBar();
        this.router.navigate(['dashboard']);
      },
      error: (error) => {
        this.isSpinnerStarted = false;
        console.log(`the error is ${error.error}`);
        console.log(`the status is ${error.status}`);
        this.isPasswordInvalid = true;
        this.errorMessage = error.error;
      },
    });
  }

  openSnackBar() {
    this._snackBar.open('Logged In Successfully', 'Splash', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
    });
  }
}
