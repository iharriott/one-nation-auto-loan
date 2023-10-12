import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private dataService: DataService) {}
  isUserLoggedIn!: boolean;

  ngOnInit(): void {
    this.dataService.loginStatus$.subscribe((data) => {
      this.isUserLoggedIn = data;
    });
  }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  login() {
    this.router.navigate(['login']);
  }
  logout() {
    this.dataService.loginStatus$.next(false);
    this.dataService.user = null;
    this.router.navigate(['']);
  }
  getLoggedInUser() {
    if (this.dataService.user != undefined) {
      return `${this.dataService.user?.firstName} ${this.dataService.user?.lastName}`;
    }
    return null;
  }

  ngOnDestroy() {
    this.dataService.loginStatus$.unsubscribe();
  }
}
