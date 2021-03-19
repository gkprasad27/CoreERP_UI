import { Component, Inject, Optional, OnInit, Input, OnChanges } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../../services/api.service';

import { AlertService } from '../../../../../services/alert.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiConfigService } from '../../../../../services/api-config.service';
import { StatusCodes } from '../../../../../enums/common/common';
import { CommonService } from '../../../../../services/common.service';
import { SnackBar } from '../../../../../enums/common/common';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../../../directives/format-datepicker';

@Component({
  selector: 'app-ShareTransfer',
  templateUrl: './ShareTransfer.component.html',
  styleUrls: ['./ShareTransfer.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ShareTransferComponent implements OnInit, OnChanges {

  modelFormData: FormGroup;
  isSubmitted = false;
  formData: any;
  companyList: any;
  tableUrl: any;
  vehicleTypes: any = [];
  getShareMembersListArray:any;
  @Input() memberCode: any;
  @Input() memberName: string;
  @Input() shareTableData: any = [];

  isFormEdit: boolean = false;
  date = new Date((new Date().getTime() - 3888000000));
  getNoOfShares1:any;

  constructor(
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    // @Optional() is used to prevent error if no data is passed
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.modelFormData = this.formBuilder.group({
      shareId: 0,
      shareTransferCode: [null],
      shareCode: 0,
      transferDate: [(new Date()).toISOString()],
      isShareTransfered: [null],
      fromMemberId: 0,
      fromMemberCode: [null],
      fromMemberName: [null],
      fromMemberSharesBefore: [null],
      fromMemberSharesAfter: [null],
      toMemberId: 0,
      toMemberCode: [null],
      toMemberName:[null],
      toMemberSharesBefore: [null],
      toMemberSharesAfter: [null],
    });

  }

  ngOnChanges() {
    this.formData = this.shareTableData[0];
    this.modelFormData.patchValue({
      toMemberCode:this.memberCode,
      toMemberName:this.memberName
    });
    if (!isNullOrUndefined(this.formData)) {
      this.seDefaults();
      this.tableUrl = {
        url: this.apiConfigService.getShareTransfer,
        registerUrl: this.apiConfigService.registerShareTransfer,
        updateUrl: this.apiConfigService.updateVehicle
      }
    }
  }

  seDefaults() {
    
  //   this.modelFormData.controls['memberId'].setValue(this.formData.memberId);
  //  this.modelFormData.controls['toMemberCode'].setValue(this.formData.memberCode);
  //   this.modelFormData.controls['memberId'].disable();
  //   this.modelFormData.controls['memberCode'].disable();
  }

  ngOnInit() {
    this.getShareTransferNo();
    this.getShareMembersList();
    this.getToMemberNoOfShares();
    this.getToMemberName();
  }

 

  getShareTableData(memberCode) {

    this.apiService.apiGetRequest(this.apiConfigService.getShareTransfer + '/' + memberCode)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              // console.log(res);
              this.shareTableData = res.response['ShareList'];
            }
          }
          this.spinner.hide();
        }
      );
  }

  getShareTransferNo(){
    this.apiService.apiGetRequest(this.apiConfigService.getShareTransferNo)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.modelFormData.patchValue({
              shareTransferCode: res.response['ShareTransferNoList']
              })
            }
          }
          this.spinner.hide();
        }
      );
  }

  getShareMembersList(){
    const getShareMembersListUrl = String.Join('/', this.apiConfigService.getShareMembersList);
    this.apiService.apiGetRequest(getShareMembersListUrl).subscribe(
      response => {
        const res = response.body;
        if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
          if (!isNullOrUndefined(res.response)) {
            if (!isNullOrUndefined(res.response['memberList']) && res.response['memberList'].length) {
              this.getShareMembersListArray = res.response['memberList'];
              this.spinner.hide();
            }
          }
        }
      });
  }

  getNoOfShares(){
    this.apiService.apiGetRequest(this.apiConfigService.getNoOfShares + '/' + this.modelFormData.get('fromMemberCode').value)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              // this.getNoOfShares1 = res.response['noOfsharesList'];
              this.modelFormData.patchValue({
                fromMemberSharesBefore:res.response['noOfsharesList'],
                fromMemberSharesAfter:0,
                toMemberSharesAfter:res.response['noOfsharesList']
              });
            }
          }
          this.spinner.hide();
        }
      );
  }

  getToMemberNoOfShares(){
    this.apiService.apiGetRequest(this.apiConfigService.getNoOfShares + '/' + this.modelFormData.get('toMemberCode').value)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              // this.getNoOfShares1 = res.response['noOfsharesList'];
              this.modelFormData.patchValue({
                toMemberSharesBefore:0
              });
            }
          }
          this.spinner.hide();
        }
      );
  }

  getToMemberName(){
    this.apiService.apiGetRequest(this.apiConfigService.getToMemberName + '/' + this.modelFormData.get('toMemberCode').value)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              this.modelFormData.patchValue({
                toMemberName:res.response['memberName']
              });
            }
          }
          this.spinner.hide();
        }
      );
  }

  setMemberCode() {
    const bname = this.getShareMembersListArray.filter(fromMemberCode => {
      if (fromMemberCode.id == this.modelFormData.get('fromMemberCode').value) {
        return fromMemberCode;
      }
    });
    if (bname.length) {
      this.modelFormData.patchValue({
        fromMembername: !isNullOrUndefined(bname[0]) ? bname[0].text : null
      });
    }
  }

  get formControls() { return this.modelFormData.controls; }

  addOrUpdateEvent(value) {
    if (value.action == 'Edit') {
      this.formData = value.item;
      if (!isNullOrUndefined(this.formData)) {
        this.modelFormData.patchValue(this.formData);
        this.modelFormData.controls['shareId'].disable();
        // this.modelFormData.controls['memberCode'].disable();
        this.isFormEdit = true;
      }
    }
  }

  save() {
  
    if (this.modelFormData.invalid) {
      return;
    }

    this.modelFormData.controls['shareId'].enable();
    this.modelFormData.patchValue({
      transferDate: this.commonService.formatDate(this.modelFormData.get('transferDate').value)
    })
    // this.modelFormData.controls['memberCode'].enable();

    let memberCode =this.memberCode;// this.modelFormData.controls['memberCode'].value;
    // this.modelFormData.patchValue({
    //   fromDate:this.commonService.formatDate(this.modelFormData.get('fromDate').value),
    //   toDate:this.commonService.formatDate(this.modelFormData.get('toDate').value)
    // });
    if (!this.isFormEdit) {
      this.apiService.apiPostRequest(this.apiConfigService.registerShareTransfer + '/' + memberCode, this.modelFormData.value)
        .subscribe(
          response => {
            const res = response.body;
            if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!isNullOrUndefined(res.response)) {
                this.alertService.openSnackBar('Record Added...', 'close', SnackBar.success);
                this.reset();
                this.getShareTableData(memberCode);
              }
            }
            this.spinner.hide();
          }
        );
    }

    else if (this.isFormEdit) {

      this.apiService.apiUpdateRequest(this.tableUrl.updateUrl, this.modelFormData.value)
        .subscribe(
          response => {
            const res = response.body;
            if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
              if (!isNullOrUndefined(res.response)) {
                this.alertService.openSnackBar('Record Updated...', 'close', SnackBar.success);
                this.reset();
                this.getShareTableData(memberCode);
              }
            }
            this.spinner.hide();
          }
        );
    }

  }

  reset() {
    this.modelFormData.reset();
    this.seDefaults();
  }

}

