import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../services/alert.service';
import { Static } from '../../enums/common/static';
import { SnackBar, StatusCodes } from '../../enums/common/common';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  openMenu = false;
  loginUser: any;
  showExpandButtons: any;
  shiftButton: string;
  shiftData: { Shift: string; Id: any; };
  employeeShift: string

  @Input() set showExpandButton(val: string) {
    this.loginUser = JSON.parse(localStorage.getItem('user'));
    this.showExpandButtons = val;
    if (this.showExpandButtons) {
      this.employeeShift = '';
      this.shiftButton = '';
      this.GetShiftId();
    }
  }


  constructor(
    public commonService: CommonService,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,

  ) {
  }

  ngOnInit() {
  }

  GetShiftId() {
    const getShiftIdUrl = String.Join('/', this.apiConfigService.getShiftId, this.loginUser.seqId, this.loginUser.branchCode);
    this.apiService.apiGetRequest(getShiftIdUrl).subscribe(
      response => {
        const res = response.body;
        if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!isNullOrUndefined(res.response)) {
            this.shiftButton = !isNullOrUndefined(res.response['ShiftId']) ? 'ShiftOUT' : 'ShiftIN'
            this.employeeShift = !isNullOrUndefined(res.response['ShiftId']) ? res.response['ShiftId'] : null
          }
        } else if (!isNullOrUndefined(res) && res.status === StatusCodes.fail) {
          this.shiftButton = 'ShiftIN'
        }
      });
  }


  logout() {
    const logoutUrl = String.Join('/', this.apiConfigService.logoutUrl, this.loginUser.seqId);
    this.apiService.apiGetRequest(logoutUrl).subscribe(
      response => {
        const res = response.body;
        this.spinner.hide();
        if (!isNullOrUndefined(res.response)) {
          this.alertService.openSnackBar(res.response, Static.Close, SnackBar.success);
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
      });
  }

  shift() {
    var logoutUrl;
    if (this.shiftButton == 'ShiftIN') {
      logoutUrl = String.Join('/', this.apiConfigService.shiftStart, this.loginUser.seqId, this.loginUser.branchCode);
    } else {
      logoutUrl = String.Join('/', this.apiConfigService.shiftTerminate, this.employeeShift);
    }

    this.apiService.apiGetRequest(logoutUrl).subscribe(
      response => {
        const res = response.body;
        this.spinner.hide();
        if (!isNullOrUndefined(res.response)) {
          this.shiftButton = !isNullOrUndefined(res.response['ShiftId']) ? 'ShiftOUT' : 'ShiftIN'
          this.employeeShift = !isNullOrUndefined(res.response['ShiftId']) ? res.response['ShiftId'] : null
          const mesage = !isNullOrUndefined(res.response['ShiftId']) ? 'Shift IN' : 'Shift Out'
          this.alertService.openSnackBar(`Successfully ${mesage}`, Static.Close, SnackBar.success);
        }
      });
  }

  openSetting() {
    this.router.navigateByUrl('/dashboard/setting');
  }

  openCloseMemu() {
    if (this.openMenu) {
      this.commonService.toggleSidebar();
      this.openMenu = false;
    } else {
      this.commonService.toggleSidebar();
      this.openMenu = true;
    }
  }
}
