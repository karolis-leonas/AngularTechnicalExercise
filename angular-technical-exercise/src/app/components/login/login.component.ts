import { ApplicationConstants } from './../../constants/application-constants';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../services/alert.service';


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

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        if (this.authenticationService.currentUserValue) {
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
        console.log(this.email);
        console.log(this.password);
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.authenticationService.login(this.email.value, this.password.value)
            .pipe(first())
            .subscribe(
                (data: any) => {
                    this.router.navigate([this.returnUrl]);
                },
                (error: any) => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
