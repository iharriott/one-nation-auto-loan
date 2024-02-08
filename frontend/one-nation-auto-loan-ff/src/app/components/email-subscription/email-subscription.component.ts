import { Component, OnDestroy } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SubscriptionApiService } from 'src/app/services/subscription-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-subscription',
  templateUrl: './email-subscription.component.html',
  styleUrls: ['./email-subscription.component.css'],
})
export class EmailSubscriptionComponent implements OnDestroy {
  private emailSubscription?: Subscription;
  constructor(
    private dataService: DataService,
    private subscriptionService: SubscriptionApiService
  ) {}

  subscribe() {
    debugger;
    const { email } = this.dataService.getLoggedInUser();

    this.subscriptionService.subscribe(email).subscribe({
      next: (data) => {
        var message =
          'Email Notification Subscription Successful. Please check email for activation link!';
        this.dataService.showSucess(message);
      },
      error: (error) => {
        var message = 'Email Notification Subscription Failed!';
        this.dataService.showSucess(message);
      },
    });
  }

  unsubscribe() {
    const { email } = this.dataService.getLoggedInUser();

    this.subscriptionService.unsubscribe(email).subscribe({
      next: (data) => {
        var message = 'User is Unsubscribed from Email Notification!';
        this.dataService.showSucess(message);
      },
      error: (error) => {
        var message = 'User Email Notifcation unubscription Failed!';
        this.dataService.showSucess(message);
      },
    });
  }

  ngOnDestroy(): void {
    this.emailSubscription?.unsubscribe();
  }
}
