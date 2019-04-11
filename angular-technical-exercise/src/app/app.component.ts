import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.model';
import { AuthenticationService } from './services/authentication.service';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(
          (userData: User) =>
            this.currentUser = userData
          );
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
