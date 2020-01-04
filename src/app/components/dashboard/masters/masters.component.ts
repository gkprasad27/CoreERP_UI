import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { String } from 'typescript-string-operations';

import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MastersService } from './masters.service';
import { isNullOrUndefined } from 'util';
import {  NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class MastersComponent implements OnInit {

  tableData: any;
  addOrUpdateData: any;
  tableUrl: any;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private mastersService: MastersService,
    private spinner: NgxSpinnerService
    ) {
      this.activatedRoute.params.subscribe( params => {
        this.tableUrl =  mastersService.getRouteUrls(params.id);
        if (!isNullOrUndefined(this.tableUrl)) {
          this.getTableData();
        }

      });

  }

  ngOnInit() {
  }



  addOrUpdateEvent(value) {
      const dialogRef = this.dialog.open(this.tableUrl.component, {
        width: '1024px',
        data: value,
        panelClass: 'custom-dialog-container',
        disableClose: true
        });
      dialogRef.afterClosed().subscribe(result => {
          this.addOrUpdateData = result;
        });
  }

  getTableData() {
  this.spinner.show();
  const getCompanyUrl = String.Join('/', this.tableUrl.url);
  this.apiService.apiGetRequest(getCompanyUrl)
            .subscribe(
            res => {
              console.log(res);
              this.spinner.hide();
              this.tableData = res.body.companies;
            });
    }

 }

