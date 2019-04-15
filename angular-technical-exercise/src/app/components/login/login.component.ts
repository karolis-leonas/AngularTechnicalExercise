import { ApplicationConstants } from './../../constants/application-constants';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    applicationConstants = ApplicationConstants;
    errorMessage: string = null;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _authenticationService: AuthenticationService
    ) {
        if (this._authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([
              Validators.required,
              Validators.pattern(this.applicationConstants.EmailValidationRegex)
            ])
          ],
            password: ['', Validators.compose([
              Validators.required,
              Validators.pattern(this.applicationConstants.PasswordValidationRegex)
            ])
          ]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get email(): AbstractControl {
      return this.loginForm.get('email');
    }

    get password(): AbstractControl {
      return this.loginForm.get('password');
    }

    onSubmit(): void {
        this.submitted = true;
        this.errorMessage = null;

        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this._authenticationService.login(this.email.value, this.password.value)
            .pipe(first())
            .subscribe(
                (data: any) => {
                    this.router.navigate([this.returnUrl]);
                },
                (error: any) => {
                    this.errorMessage = error;
                    this.loading = false;
                });
    }
}
