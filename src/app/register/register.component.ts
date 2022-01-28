import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, AuthenticationService } from '../_services';
import { MeasureService } from '../_services/Measure.service';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private energyService:MeasureService, 
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required, Validators.email],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {

        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
      
        this.authenticationService.signUp(this.registerForm.value.username, this.registerForm.value.password)
            .then(
              res => {
                console.log('You are Successfully signed up!', res);
                this.alertService.success('Registration successful', true);

                this.energyService.createUser(this.registerForm.value.username, this.registerForm.value.password)

                this.router.navigate(['/login']);
                }
            )
            .catch(error => {
              console.log(error);
              this.alertService.error("The email address is already in use by another account");
              this.loading = false;
            });
                
    }
}
