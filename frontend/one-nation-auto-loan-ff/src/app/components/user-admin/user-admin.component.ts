import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css'],
})
export class UserAdminComponent implements OnInit, OnDestroy {
  @Output() closeUserAdminButtonClicked = new EventEmitter<any>();
  userForm!: FormGroup;
  private updateUserSubscription?: Subscription;
  roles = CommonConstants.roles;
  organizations = CommonConstants.organizations;
  userName!: string;
  userFullName!: string;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialog: MatDialog,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnDestroy(): void {
    this.updateUserSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const { userName, firstName, lastName } = this.dataService.currentUser;
    console.log(`user ${JSON.stringify(this.dataService.currentUser)}`);
    this.userName = userName;
    this.userFullName = `${firstName} ${lastName}`;
    this.createForm();
    this.userForm.patchValue(this.dataService.currentUser);
  }

  createForm() {
    this.userForm = this.fb.group({
      pk: [''],
      sk: [''],
      role: [''],
      organization: [''],
    });
  }

  get userRoles(): FormControl {
    return this.userForm.get('role') as FormControl;
  }

  get userOrganization(): FormControl {
    return this.userForm.get('organization') as FormControl;
  }

  submit() {
    //debugger;
    const userData = this.userForm.getRawValue();
    this.updateUserSubscription = this.authService
      .updateUserRoleOrganization(userData)
      .subscribe({
        next: (data) => {
          const message = 'User role/organization updated Successfully';
          this.dataService.showSucess(message);
          this.dataService.getAllUsers();
          this.close();
        },
        error: (error) => {
          const message = 'User update Failed';
          this.dataService.showError(message);
        },
      });
  }

  close() {
    this.closeUserAdminButtonClicked.emit('Admin');
  }

  clear() {
    this.userForm.reset();
  }
}
