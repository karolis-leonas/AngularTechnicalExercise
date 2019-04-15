import { ApplicationConstants } from './../../constants/application-constants';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { InputMatchValidator } from '../../validators/password-match-validator';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component(
  {
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.css']
  }
)
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    applicationConstants = ApplicationConstants;
    errorMessage: string = null;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
          email: ['', [
            Validators.required,
            Validators.pattern(this.applicationConstants.EmailValidationRegex)
          ]],
          password: ['',
            [
              Validators.required,
              Validators.minLength(6),
              Validators.pattern(this.applicationConstants.PasswordValidationRegex)
            ]
          ],
          confirmPassword: ['',
            [
              Validators.required,
              Validators.minLength(6),
              Validators.pattern(this.applicationConstants.PasswordValidationRegex),
              InputMatchValidator('password')
            ]
          ]
        });
    }

    get email(): AbstractControl {
      return this.registerForm.get('email');
    }

    get password(): AbstractControl {
      return this.registerForm.get('password');
    }

    get confirmPassword(): AbstractControl {
      return this.registerForm.get('confirmPassword');
    }

    onSubmit(): void {
        this.submitted = true;
        console.log(this.email);
        console.log(this.password);
        console.log(this.confirmPassword);
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.email.value, this.password.value)
            .pipe(first())
            .subscribe(
                (data) => {
                    this.router.navigate(['/login']);
                },
                (error) => {
                  this.errorMessage = error;
                  this.loading = false;
                });
    }
}
