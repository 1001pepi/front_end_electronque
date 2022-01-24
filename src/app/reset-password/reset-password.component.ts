import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../_services';
import { MeasureService } from '../_services/Measure.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  authenticationService: any;
  loading = false;
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;

  constructor(private energyService:MeasureService, 
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,) { }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required, Validators.email],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
}

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(this.f.username.value, this.f.password.value)
          .then(
            (res:any) => {
              console.log(res)
              localStorage.setItem('currentUser', JSON.stringify(res.user));
              this.router.navigate(['/login']);
            }
          )
          .catch(error => {
            console.log('Something went wrong:', error.message);
            this.alertService.error("Wrong credentials");
            this.loading = false;
          });
  }
  /*fonction pour se déconnecter*/
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
