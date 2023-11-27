import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private dataService: DataService) {}
  ngOnInit(): void {
    // this.isUserLoggedIn = this.dataService.isUserLoggedIn;
  }
  isUserLoggedIn!: boolean;
  loginPopup() {
    this.router.navigate(['login']);
  }
  logout() {
    //this.dataService.isUserLoggedIn = false;
    this.router.navigate(['home']);
  }

  getLoggedInUser() {
    return 'Ian Harriott';
  }
  getAccount() {
    return true;
  }
}
