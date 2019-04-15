import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
      private _authenticationService: AuthenticationService) { }

  logout() {
      this._authenticationService.logout();
  }

  public checkIfLoggedIn() {
      return (this._authenticationService.checkIfLoggedIn() != null);
  }
}
