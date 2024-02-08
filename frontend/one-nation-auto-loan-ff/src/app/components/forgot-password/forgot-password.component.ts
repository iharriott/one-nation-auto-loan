import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  passwordUpdateForm!: FormGroup;
  type: string = 'password';
  eyeIcon: string = 'fa-eye-slash';
  private signupSubscription?: Subscription;
  isSpinnerStarted = false;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.passwordUpdateForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.type = this.type === 'password' ? 'text' : 'password';
    this.eyeIcon = this.type === 'password' ? 'fa-eye-slash' : 'fa-eye';
  }

  onUpdate() {
    if (this.passwordUpdateForm.valid) {
      this.isSpinnerStarted = true;
      console.log(this.passwordUpdateForm.value);
      const formValues = this.passwordUpdateForm.getRawValue();
      this.signupSubscription = this.authService
        .updatePassword(formValues)
        .subscribe({
          next: (data) => {
            const { message } = data;
            this.isSpinnerStarted = false;
            this.passwordUpdateForm.reset();
            this.dataService.showSucess(message);
            this.router.navigate(['login']);
            console.log(data);
          },
          error: (error) => this.dataService.showError('Signup Failed'),
        });
    } else {
      this.dataService.validateAllFormFields(this.passwordUpdateForm);
      alert('Your form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.signupSubscription?.unsubscribe();
  }
}
