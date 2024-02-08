import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  type: string = 'password';
  eyeIcon: string = 'fa-eye-slash';
  private signupSubscription?: Subscription;
  isSpinnerStarted = false;

  signUpForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      userName: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.type = this.type === 'password' ? 'text' : 'password';
    this.eyeIcon = this.type === 'password' ? 'fa-eye-slash' : 'fa-eye';
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      this.isSpinnerStarted = true;
      console.log(this.signUpForm.value);
      const formValues = this.signUpForm.getRawValue();
      this.signupSubscription = this.authService.signup(formValues).subscribe({
        next: (data) => {
          const { message } = data;
          this.isSpinnerStarted = false;
          this.signUpForm.reset();
          this.dataService.showSucess(message);
          this.router.navigate(['login']);
          console.log(data);
        },
        error: (error) => this.dataService.showSucess('Signup Failed'),
      });
    } else {
      this.dataService.validateAllFormFields(this.signUpForm);
      alert('Your form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.signupSubscription?.unsubscribe();
  }
}
