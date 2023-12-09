import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dataService: DataService,
    public auth: AuthService,
    private userStore: UserStoreService
  ) {}
  isUserLoggedIn!: boolean;
  collapsed = signal(true);
  public fullName: string = '';
  role!: string;

  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  ngOnInit(): void {
    //debugger;

    this.dataService.loginStatus$.subscribe((data) => {
      this.isUserLoggedIn = data;
    });

    if (this.dataService.getLoggedInUser() != null) {
      this.isUserLoggedIn = true;
    }

    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullnameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getfullnameFromToken();
      this.role = val || roleFromToken;
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
    //debugger;
    this.dataService.loginStatus$.next(false);
    this.dataService.user = null;
    this.auth.signOut();
    this.dataService.primaryApplicant = null;
    this.dataService.editMode$.next(false);
  }
  getLoggedInUser() {
    //debugger;
    const user = this.dataService.getLoggedInUser();
    if (user !== undefined && user !== null) {
      const { userName } = user;
      if (userName !== null) {
        return userName;
      }
    }

    // if (this.dataService.user != undefined) {
    //   return `${this.dataService.user?.firstName} ${this.dataService.user?.lastName}`;
    // }
    return null;
  }

  ngOnDestroy() {
    this.dataService.loginStatus$.unsubscribe();
  }
}
