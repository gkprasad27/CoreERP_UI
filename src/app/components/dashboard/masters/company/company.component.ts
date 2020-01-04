import { Component, Inject, Optional, OnInit } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { AlertService } from '../../../../services/alert.service';
import { Company } from '../../../../models/company.model';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { isNullOrUndefined } from 'util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent  implements OnInit {

  companyForm: FormGroup;
  isSubmitted  =  false;
  formData: any;


  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CompanyComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {

      this.companyForm  =  this.formBuilder.group({
        code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]],
        name: ['', [Validators.required, Validators.minLength(2)]],
        address1: [''],
        address2: [''],
        address3: [''],
        address4: [''],
        place: [''],
        state: [''],
        pinCode: [''],
        phone_1: [''],
        phone_2: [''],
        phone_3: [''],
        email: [''],
        panNo: [''],
        tanNo: [''],
        gstNo: [''],
        natureOfBusiness: [''],
        finacialYear: [''],
        fromMonth: [''],
        toMonth: [''],
      });


      this.formData = {...data};
      if (!isNullOrUndefined(this.formData.item)) {
        this.companyForm.patchValue(this.formData.item);
      }

  }

  ngOnInit() {

  }




  showErrorAlert(caption: string, message: string) {
      // this.alertService.openSnackBar(caption, message);
  }

  get formControls() { return this.companyForm.controls; }


  save() {
    if (this.companyForm.invalid) {
      return;
    }
    this.formData.item = this.companyForm.value;
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }

}
