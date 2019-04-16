import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { AuthenticationService } from './services/authentication.service';
import { InactivityService } from './services/inactivity.service';
import { SubscriptionLike } from 'rxjs';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
    currentUser: User;
    timeoutSubscription: SubscriptionLike;

    constructor(
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _inactivityService: InactivityService
    ) {
        this._authenticationService.currentUser.subscribe(
          (userData: User) =>
            this.currentUser = userData
          );
    }

    ngOnInit(): void {
      if (this.currentUser != null) {
        this.timeoutSubscription = this._inactivityService.getTimeoutObservable().subscribe(
          () => {
            this.logout();
          },
          (error) => {
            console.error(error);
          }
        );
        this._inactivityService.startChecking();
      }
    }

    ngOnDestroy(): void {
      if(this.timeoutSubscription) {
        this.timeoutSubscription.unsubscribe();
      };
    }

    logout() {
        this._authenticationService.logout();
        this._router.navigate(['/login']);
    }
}
