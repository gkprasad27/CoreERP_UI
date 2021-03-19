import { Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { String } from 'typescript-string-operations';

import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ReportsService } from './reports.service';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatusCodes } from '../../../enums/common/common';
import { DeleteItemComponent } from '../../../reuse-components/delete-item/delete-item.component';
import { ReportTableComponent } from '../../../reuse-components/report-table/report-table.component';
import { AlertService } from '../../../services/alert.service';
import { SnackBar } from '../../../enums/common/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  tableData: any;
  headerData:any;
  footerData:any;
  tableUrl: any;
  route: any;
  @ViewChild(ReportTableComponent, { static: false }) reportTableComponent: ReportTableComponent;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private reportsService: ReportsService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
  ) { 
    const user = JSON.parse(localStorage.getItem('user'));
    this.reportsService.branchCode = user.branchCode;
    activatedRoute.params.subscribe(params => {
      this.tableUrl = reportsService.getRouteUrls(params.id);
      this.route = params.id;
      if (!isNullOrUndefined(this.tableUrl)) {
        this.getTableData();
        if (!isNullOrUndefined(this.reportTableComponent)) {
          this.reportTableComponent.defaultValues();
        }
      }

    });
  }

  ngOnInit() {
  }
  generateTableEvent(value) {
    this.spinner.show();
    const getUrl = String.Join('/', this.tableUrl.url);

    this.apiService.apiGetRequest(getUrl,value)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              if (this.route == 'Intimate Sale') {
                this.tableData = this.removeDuplicate(res.response[this.tableUrl.listName])
              } else {
                this.tableData = res.response[this.tableUrl.listName];
              }
              this.headerData = res.response['headerList'];
              this.footerData = res.response['footerList'];
            }
          }
          this.spinner.hide();
        }, error => {

      });
  }
  getTableData() {
    this.spinner.show();
    const getUrl = String.Join('/', this.tableUrl.url);

    this.apiService.apiGetRequest(getUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              if (this.route == 'Intimate Sale') {
                this.tableData = this.removeDuplicate(res.response[this.tableUrl.listName])
              } else {
                this.tableData = res.response[this.tableUrl.listName];
              }
              this.headerData = res.response['headerList'];
              this.footerData = res.response['footerList'];
            }
          }
          this.spinner.hide();
        }, error => {

      });
  }

  removeDuplicate(data) {
    let array = [];
    let vehicle = '';
    if (!isNullOrUndefined(data)) {
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          if (vehicle != data[i].Vehicle) {
            if (vehicle != '') {
              array[i - 1].Qty = data[i - 1].Qty;
              array[i - 1].Amount = data[i - 1].Amount;
            }
            array.push(JSON.parse(JSON.stringify(data[i])));
            vehicle = data[i].Vehicle;
          } else {
            vehicle = data[i].Vehicle;
            array.push(JSON.parse(JSON.stringify(data[i])));
            array[i].Vehicle = null;
          }          
          array[i].Qty = null;
          array[i].Amount = null;
        }
      }
    }
    return array;
  }


  // removeDuplicate(data) {
  //   let array = [];
  //   let vehicle = '';
  //   if (!isNullOrUndefined(data)) {
  //     if (data.length) {
  //       for (let i = 0; i < data.length; i++) {
  //         if (vehicle != data[i].Vehicle) {
  //           array.push(data[i]);
  //           vehicle = data[i].Vehicle;
  //         } else {
  //           vehicle = data[i].Vehicle;
  //           data[i].Vehicle = null;
  //           data[i].Qty = null;
  //           data[i].Amount = null;
  //           array.push(data[i]);
  //         }
  //       }
  //     }
  //   }
  //   return array;
  // }

}
