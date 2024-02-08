import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    public dataService: DataService,
    private userStoreService: UserStoreService,
    private authService: AuthService
  ) {}

  roles!: string;
  ngOnInit(): void {
    console.log(`token roles ${this.roles}`);
    this.determineAccess();
    //   },
    // this.userStoreService.getRoleFromStore().subscribe({
    //   next: (data) => {
    //     this.roles = data;

    //     console.log(this.roles);
    //   },
    //   error: console.log,
    // });
  }

  determineAccess() {
    //debugger;
    this.roles = this.authService.getRoleFromToken();

    const rolesArray = this.roles.split(',');
    if (rolesArray.find((x) => x == 'User')) {
      this.dataService.isUser.set(true);
    }

    if (rolesArray.find((x) => x == 'Admin')) {
      this.dataService.isAdmin.set(true);
    }

    if (rolesArray.find((x) => x == 'Staff')) {
      this.dataService.isStaff.set(true);
    }

    this.router.navigate(['dashboard']);
  }

  applicantList() {
    this.router.navigate(['applicantlist']);
  }

  aggridList() {
    this.router.navigate(['aggridlist']);
  }

  affiliateList() {
    this.router.navigate(['affiliatelist']);
  }

  userList() {
    this.router.navigate(['useradminlist']);
  }

  subscribe() {
    this.router.navigate(['subscribe']);
  }

  editFileList() {}
  addNewFile() {}
  viewCharacteristics() {}
}
