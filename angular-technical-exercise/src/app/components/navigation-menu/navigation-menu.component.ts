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
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService) { }

  private logout() {
      this.authenticationService.logout();
  }

  public checkIfLoggedIn() {
      return (this.authenticationService.checkIfLoggedIn() != null);
  }
}
