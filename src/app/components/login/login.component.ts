import { UserLogin } from '../../models/user-login.model';
import { AlertService } from '../../services/alert.service';
import { ApiService } from '../../services/api.service';
import { String } from 'typescript-string-operations';
import { CommonService } from '../../services/common.service';

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/common/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../services/api-config.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar } from '../../enums/common/snackbar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;
  isSubmitted  =  false;


  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiConfigService: ApiConfigService,
    public translate: TranslateService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.loginForm  =  this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    localStorage.setItem('loginUser', null);

  }

  setLang(lang) {
    localStorage.setItem('defaultLang' , lang.toLowerCase());
    this.translate.use(lang.toLowerCase());

    this.translate.currentLang = lang;
    // this.commonService.languageConfig();

  }


  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginAPICall();
  }

loginAPICall() {
  this.spinner.show();
  this.isSubmitted = true;
  this.alertService.openSnackBar('Attempting login...', 'close', SnackBar.normal);
  const requestObj = { UserName: this.loginForm.get('username').value, Password: this.loginForm.get('password').value };
  const getLoginUrl = String.Join('/', this.apiConfigService.loginUrl);

  this.apiService.apiPostRequest(getLoginUrl, requestObj)
      .subscribe(
      user => {
        this.alertService.openSnackBar('Login sussfull...', 'close', SnackBar.success);
        this.spinner.hide();
        this.authService.login(this.loginForm.value);
        this.router.navigate(['dashboard']);
      },
      error => {
        this.isSubmitted = false;
        this.alertService.openSnackBar('Login Failed...', 'close', SnackBar.error);
      });
}


get formControls() { return this.loginForm.controls; }

}
