import { String } from 'typescript-string-operations';
import {
  Component, OnInit, ViewChild, Input, OnChanges,
  ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatTable } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { isNullOrUndefined } from 'util';
import { ActivatedRoute } from '@angular/router';
import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { SearchFilterTableComponent } from '../search-filter-table/search-filter-table.component';
import { NgxSpinnerService } from 'ngx-spinner';
// search

import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject, pipe } from 'rxjs';
import { take, takeUntil, map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { User } from '../../models/common/user';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ReportsInnerTableComponent } from '../reports-inner-table/reports-inner-table.component';
import { ApiService } from 'src/app/services/api.service';
import { ApiConfigService } from 'src/app/services/api-config.service';
import { runInThisContext } from 'vm';
import { ReportsService } from 'src/app/components/dashboard/reports/reports.service';
import { StatusCodes } from 'src/app/enums/common/common';
import * as moment from 'moment';
import { style } from '@angular/animations';
@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit, OnChanges {
  selectedDate = {start : moment().add(-1, 'day'), end: moment().add(0, 'day')};
  GetBankPAccountLedgerListArray=[];
  GetProductListArray=[];
  public tableMultiCtrl: FormControl = new FormControl();
  public filteredTableMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected onDestroy = new Subject<void>();

  dateForm: FormGroup;
  params = new HttpParams();
  @Input() tableData: any;
  @Input() headerData: any = [];
  @Input() footerData: any;
  @Output() generateTable = new EventEmitter();

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  highlightedRows = [];
  columnDefinitions = [];
  filterColData = [];

  keys = [];
  index: any;
  user: User;
  routeParam: any;
  excelUrl: any;
  Reports = [
    // { id: '1', reportName: 'Shift Report' },
    { id: '2', reportName: 'Shift wise Meter Reading' },
    { id: '3', reportName: 'Shift wise sales stock' },
    { id: '4', reportName: 'Shift wise hdfc bank account' },
    { id: '5', reportName: 'Shift wise  fleet card account' },
    { id: '6', reportName: 'Shift wise daily sales report' },
    { id: '7', reportName: 'Shift wise Sale Value' },
    { id: '8', reportName: 'Shift wise ICICI SWIPE RECEIVABLES A/c' }
  ];
  AccountLedgers = [];
  ReportBranches = [];
  ReportPGList=[];
  ReportSGList=[];
  Products = [];

  tableHeaders: any = [];
  SearchCriteria=[
    {id:'username',parameter:'User Name'},
    {id:'branchCode',parameter:'Branch Code'},
    {id:'shiftId',parameter:'Shift Id'},
    {id:'userId',parameter:'User Id'}
  ];
  search =[];
  ReportsType = [
    { id: '1', reportName: 'Product Price List All Branch Report' },
    { id: '2', reportName: 'Product Price List By Branch Report' }
  ];
  TrialBalanceReportType = [
    { id: '1', reportName: 'Trial Balance Report' },
    { id: '2', reportName: 'Trial Balance Group Report' }
  ];
  ClosingBalanceReportType = [
    { id: '1', reportName: 'Credit' },
    { id: '2', reportName: 'Debit' },
    { id: '3', reportName: 'Both'}
  ];
  FourColumnReportType=[
    {id:'1', reportName:'FourColumn Cash Book By Branch'},
    {id:'2', reportName:'FourColumn Cash Book COnsolidate'}
  ];
  GroupName=[
    {id:'Spares',parameter:'Spares'},
    {id:'Lubes',parameter:'Lubes'},
    {id:'Fuels',parameter:'Fuels'}
  ];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private apiService: ApiService,
    private apiConfigService: ApiConfigService,
    private reportsService: ReportsService,
    private spinner: NgxSpinnerService,
  ) {
    this.user = JSON.parse(localStorage.getItem('user'));

    this.dateForm = this.formBuilder.group({
      selected:[null],
      formDate: ['', Validators.required],
      toDate: ['', Validators.required],
      selectedReport: [''],
      selectedAccountLedger: [''],
      selectedBranch: [],
      selectedProduct: [],
      selectedCriteria:[''],
      vehicleRegNo:[null],
      search:[null],
      selectedReportType:[''],
      selectedTrialReportType:[''],
      selectedClosingReportType:[''],
      fromAccountLedger: [''],
      toAccountLedger: [''],
      RO:[null],
      selectedFourColumnReportType:[''],
      selectedGroupName:[''],
      selectedSupplierGroup:['']
    }, { validator: this.checkDates });

    activatedRoute.params.subscribe(params => {
      this.routeParam = params.id;
      this.tableHeaders = [];
      this.dateForm.reset();
    });

  }
  checkDates(group: FormGroup) {
    if (group.controls.formDate.value < group.controls.toDate.value) {
      return { notValid: true }
    }
    return null;
  }
  defaultValues() {
    this.params = new HttpParams();
    this.dataSource = new MatTableDataSource();
    this.highlightedRows = [];
    this.columnDefinitions = [];
    this.keys = [];
    this.index = null;
    this.filterColData = [];
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  checkboxCheck(index) {

    this.filterColData[index] = {
      def: this.filterColData[index].def,
      label: this.filterColData[index].label, hide: !this.filterColData[index].hide
    };

  }

  checkCheckBoxvalue(event){
    this.dateForm.patchValue({
      RO:event.checked
    })
 }

  saveChanges() {
    this.columnDefinitions = this.filterColData.slice(0);
    this.filterColData = [];
  }
  getDisplayedColumns(): string[] {
    if (!isNullOrUndefined(this.tableData)) {
      return this.columnDefinitions.filter(cd => cd.hide).map(cd => cd.def);
    }
  }
  toggleSelectAll(selectAllValue: boolean) {
    this.filteredTableMulti.pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.tableMultiCtrl.patchValue(val);
        } else {
          this.tableMultiCtrl.patchValue([]);
        }
      });
  }

  getAccountLedgersList() {
    const getLoginUrl = String.Join('/', this.apiConfigService.getAccountLedgersList);
    this.apiService.apiGetRequest(getLoginUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === 'PASS') {
            if (!isNullOrUndefined(res.response['accountLedgerList'])) {
              this.AccountLedgers = res.response['accountLedgerList'];
            }
          }
        });
  }
  getReportBranchesList() {
    const getLoginUrl = String.Join('/', this.apiConfigService.getReportBranchList);
    this.apiService.apiGetRequest(getLoginUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === 'PASS') {
            if (!isNullOrUndefined(res.response['reportBranchesList'])) {
              this.ReportBranches = res.response['reportBranchesList'];
            }
          }
        });
  }
  getReportPGList() {
    const getLoginUrl = String.Join('/', this.apiConfigService.getReportPGList);
    this.apiService.apiGetRequest(getLoginUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === 'PASS') {
            if (!isNullOrUndefined(res.response['reportPGList'])) {
              this.ReportPGList = res.response['reportPGList'];
            }
          }
        });
  }
  getReportSGList() {
    const getLoginUrl = String.Join('/', this.apiConfigService.getReportSGList);
    this.apiService.apiGetRequest(getLoginUrl)
      .subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === 'PASS') {
            if (!isNullOrUndefined(res.response['reportSGList'])) {
              this.ReportSGList = res.response['reportSGList'];
            }
          }
        });
  }
  // getProductsList() {
  //   const getLoginUrl = String.Join('/', this.apiConfigService.getStockProducts);
  //   this.apiService.apiGetRequest(getLoginUrl)
  //     .subscribe(
  //       response => {
  //         const res = response.body;
  //         if (!isNullOrUndefined(res) && res.status === 'PASS') {
  //           if (!isNullOrUndefined(res.response['productList'])) {
  //             this.Products = res.response['productList'];
  //           }
  //         }
  //       });
  // }

  getProductsList(value) {
    if (!isNullOrUndefined(value) && value != '') {
      const getProductListUrl = String.Join('/', this.apiConfigService.getStockProducts, value);
      this.apiService.apiGetRequest(getProductListUrl).subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              if (!isNullOrUndefined(res.response['ProductList']) && res.response['ProductList'].length) {
                this.GetProductListArray = res.response['ProductList'];
                //this.getCashPartyAccount();
              } else {
                this.GetProductListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetBankPAccountLedgerListArray = [];
    }
  }

  getBankPAccountLedgerList(value) {
    if (!isNullOrUndefined(value) && value != '') {
      const getBankPAccountLedgerListUrl = String.Join('/', this.apiConfigService.getBPAccountLedgerList, value);
      this.apiService.apiGetRequest(getBankPAccountLedgerListUrl).subscribe(
        response => {
          const res = response.body;
          if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
            if (!isNullOrUndefined(res.response)) {
              if (!isNullOrUndefined(res.response['AccountLedgerList']) && res.response['AccountLedgerList'].length) {
                this.GetBankPAccountLedgerListArray = res.response['AccountLedgerList'];
                //this.getCashPartyAccount();
              } else {
                this.GetBankPAccountLedgerListArray = [];
              }
            }
            this.spinner.hide();
          }
        });
    } else {
      this.GetBankPAccountLedgerListArray = [];
    }
  }

  setLedgerName(value) {
    const lname = this.GetBankPAccountLedgerListArray.filter(lCode => {
      if (lCode.id == this.dateForm.get('selectedAccountLedger').value) {
        return lCode;
      }
    });
    this.dateForm.patchValue({
      selectedAccountLedger: !isNullOrUndefined(lname[0]) ? lname[0].id : null
    });
  }

  setProductName(value) {
    const pname = this.GetProductListArray.filter(pCode => {
      if (pCode.id == this.dateForm.get('selectedProduct').value) {
        return pCode;
      }
    });
    this.dateForm.patchValue({
      selectedProduct: !isNullOrUndefined(pname[0]) ? pname[0].id : null
    });
  }

  setfromLedgerName(value) {
    const lname = this.GetBankPAccountLedgerListArray.filter(lCode => {
      if (lCode.id == this.dateForm.get('fromAccountLedger').value) {
        return lCode;
      }
    });
    this.dateForm.patchValue({
      fromAccountLedger: !isNullOrUndefined(lname[0]) ? lname[0].id : null
    });
  }

  settoLedgerName(value) {
    const lname = this.GetBankPAccountLedgerListArray.filter(lCode => {
      if (lCode.id == this.dateForm.get('toAccountLedger').value) {
        return lCode;
      }
    });
    this.dateForm.patchValue({
      toAccountLedger: !isNullOrUndefined(lname[0]) ? lname[0].id : null
    });
  }

  GenerateReport() {
    this.dateForm.patchValue({
      formDate: this.commonService.formatReportDate(this.dateForm.value.selected.start._d),
      toDate: this.commonService.formatReportDate(this.dateForm.value.selected.end._d),
      selectedReport: this.dateForm.get('selectedReport').value,
      selectedAccountLedger: this.dateForm.get('selectedAccountLedger').value,
      selectedBranch: this.dateForm.get('selectedBranch').value,
      selectedProduct: this.dateForm.get('selectedProduct').value,
      vehicleRegNo:this.dateForm.get('vehicleRegNo').value,
      selectedCriteria:this.dateForm.get('selectedCriteria').value,
      search:this.dateForm.get('search').value,
      selectedReportType:this.dateForm.get('selectedReportType').value,
      selectedTrialReportType:this.dateForm.get('selectedTrialReportType').value,
      selectedClosingReportType:this.dateForm.get('selectedClosingReportType').value,
      fromAccountLedger: this.dateForm.get('fromAccountLedger').value,
      toAccountLedger: this.dateForm.get('toAccountLedger').value,
      RO: this.dateForm.get('RO').value,
      selectedFourColumnReportType:this.dateForm.get('selectedFourColumnReportType').value,
      selectedGroupName:this.dateForm.get('selectedGroupName').value,
      selectedSupplierGroup:this.dateForm.get('selectedSupplierGroup').value,
    })
    this.params = new HttpParams();
    this.params = this.params.append('UserID', 'admin');//this.user.userName);
    this.params = this.params.append('fromDate', this.dateForm.value.formDate);
    this.params = this.params.append('toDate', this.dateForm.value.toDate);
    this.params = this.params.append('reportID', this.dateForm.value.selectedReport);
    this.params = this.params.append('ledgerCode', this.dateForm.value.selectedAccountLedger);
    this.params = this.params.append('branchCode', this.dateForm.value.selectedBranch);
    this.params = this.params.append('productCode', this.dateForm.value.selectedProduct);
    this.params = this.params.append('selectedCriteria',this.dateForm.value.selectedCriteria);
    this.params = this.params.append('search',this.dateForm.value.search);
    this.params = this.params.append('vehicleRegNo', this.dateForm.value.vehicleRegNo);
    this.params = this.params.append('reportType', this.dateForm.value.selectedReportType);
    this.params = this.params.append('TrialreportType', this.dateForm.value.selectedTrialReportType);
    this.params = this.params.append('ClosingreportType', this.dateForm.value.selectedClosingReportType);
    this.params = this.params.append('fromLedgerCode', this.dateForm.value.fromAccountLedger);
    this.params = this.params.append('toLedgerCode', this.dateForm.value.toAccountLedger);
    this.params = this.params.append('RO', this.dateForm.value.RO);
    this.params = this.params.append('fourColumnreportType', this.dateForm.value.selectedFourColumnReportType);
    this.params = this.params.append('GroupName',this.dateForm.value.selectedGroupName);
    this.params = this.params.append('SupplierGroup',this.dateForm.value.selectedSupplierGroup);
    if(this.dateForm.value.selectedCriteria=="shiftId")
    {
      this.params = this.params.append('shiftId', this.dateForm.value.search);
    }
    if(this.routeParam=='Shift' && this.dateForm.value.selectedCriteria=='branchCode'){
      this.reportsService.branchCode=this.dateForm.value.search;
      this.reportsService.dynamicData.url=`${this.apiConfigService.getDefaultShiftReport}/${this.reportsService.branchCode}`;
    }
    if(this.routeParam=='Shift' && this.dateForm.value.selectedCriteria!='branchCode'){
      this.reportsService.branchCode=this.dateForm.value.search;
      this.reportsService.dynamicData.url=`${this.apiConfigService.getDefaultShiftReport}/${null}`;
    }
    // else
    // {
    //    this.params = this.params.append('vehicleRegNo', this.dateForm.value.vehicleRegNo);
    // }
    
    this.generateTable.emit(this.params);

    this.dateForm.controls['formDate'].setValue(new Date(this.dateForm.controls['formDate'].value));
    this.dateForm.controls['toDate'].setValue(new Date(this.dateForm.controls['toDate'].value));
  }

  exportToExcel(): void {
    let columns = [];
    for (const key in this.tableData[0]) {
      columns.push(key);
    }
    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report', {
      pageSetup: { fitToPage: true, paperSize: 11, orientation: 'landscape' }
    });
    //Add Row and formatting
    let titleRow = worksheet.addRow([this.routeParam + ' Report']);
    titleRow.font = { name: 'Calibri', family: 4, size: 16, underline: 'single', bold: true }
    titleRow.alignment = { horizontal: 'center' }
    worksheet.mergeCells(1, 1, 2, columns.length);
    worksheet.addRow([]);

    let headerRows = [];
    for (var i: number = 0; i < this.headerData.length; i++) {
      headerRows[i] = [];
      let j = 0;
      for (const key in this.headerData[0]) {
        headerRows[i][j] = this.headerData[i][key];
        j++;
      }
    }

    headerRows.forEach(d => {
      let row = worksheet.addRow(d);
    });

    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row

    let headerRow = worksheet.addRow(columns);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
        cell.font = { bold: true }
    })
    worksheet.columns.forEach(col => {
      col.width = 20;
    }

    )
    let rows = [];
    for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
      rows[i] = [];
      let j = 0;
      for (const key in this.tableData[0]) {
        rows[i][j] = this.dataSource.filteredData[i][key];
        j++;
      }
    }
    rows.forEach(d => {
      let row = worksheet.addRow(d);
    });
    worksheet.addRow([]);
    //Adding fooer Rows
    let footerRows = [];
    for (var i: number = 0; i < this.footerData.length; i++) {
      footerRows[i] = [];
      let j = 0;
      for (const key in this.footerData[0]) {
        footerRows[i][j] = this.footerData[i][key];
        j++;
      }
    }

    footerRows.forEach(d => {
      let row = worksheet.addRow(d);
    });
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.routeParam + 'Report.xlsx');
    });
  }

  exportToPdf() {
    if(this.routeParam=='Product Wise Monthly Purchase'||this.routeParam=='BranchWise Monthly SalesByLiters'||this.routeParam=='ProductMonthWise PurchaseLtrs'){
      let doc = new jsPDF('l', 'cm', 'a3');
    
    let columns = []; //["ID", "Name", "Country"];
    for (const key in this.tableData[0]) {
      columns.push(key);
    }
    let rows = [];
    for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
      rows[i] = [];
      let j = 0;
      for (const key in this.tableData[0]) {
        rows[i][j] = this.dataSource.filteredData[i][key];
        j++;
      }
    }

    doc.autoTable({
      body: [
        [{ content: this.routeParam + ' Report', colSpan: 3, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }],
      ],
      theme: 'plain'
    });
    let pipe = new DatePipe('en-US');
    let currentDate = new Date();

    let headerRows = [];
    for (var i: number = 0; i < this.tableHeaders.length; i++) {
      headerRows[i] = [];
      let j = 0;
      for (const key in this.tableHeaders[0]) {
        headerRows[i][j] = this.tableHeaders[i][key];
        j++;
      }
    }

    headerRows = [
      headerRows[0] ? headerRows[0].concat(headerRows[1]) : "",
      headerRows[2] ? headerRows[2].concat(headerRows[3]) : "",
      headerRows[4] ? headerRows[4].concat(headerRows[5]) : "",
      headerRows[6] ? headerRows[6].concat(headerRows[7]) : "",
      headerRows[8] ? headerRows[8].concat(headerRows[9]) : "",
      headerRows[10] ? headerRows[10].concat(headerRows[11]) : "",
      headerRows[12] ? headerRows[12].concat(headerRows[13]) : "",
      headerRows[14] ? headerRows[14].concat(headerRows[15]) : ""
    ];

    headerRows = headerRows.filter(arr => arr != "");



    doc.autoTable({
      margin: { top: 3 },
      columnStyles: {
        1: { halign: 'right' }
      },
      body: headerRows,
      theme: 'plain',
    })
    
    

    doc.autoTable(columns, rows, { startY: doc.autoTable.previous.finalY + 2, styles: { font: 'Tahoma',fontSize: 10}, theme: 'plain' });
     

    let footerRows = [];
    
    for (var i: number = 0; i < this.footerData.length; i++) {
      footerRows[i] = [];
      let j = 0;
      for (const key in this.footerData[0]) {
        footerRows[i][j] = this.footerData[i][key];
        j++;
      }
    }

    let updatedFooterRows = [];

    if (footerRows && footerRows.length) {
      footerRows.forEach((ft) => {
        let temp = [];
        ft.forEach(data => {
          if (data != "") {
            temp.push(data);
          }
        });
        updatedFooterRows.push(temp);
      })
    }

    doc.autoTable({
      body: updatedFooterRows,
      theme: 'plain',
      startY: doc.autoTable.previous.finalY + 2
    })
    doc.save(this.routeParam + 'Report.pdf');
    }
    
    if(this.routeParam=='Four Column Cash Book'){
      let doc = new jsPDF('p', 'in', [1008, 792]);
    
      let columns = []; //["ID", "Name", "Country"];
      for (const key in this.tableData[0]) {
        columns.push(key);
      }
      let rows = [];
      for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
        rows[i] = [];
        let j = 0;
        for (const key in this.tableData[0]) {
          rows[i][j] = this.dataSource.filteredData[i][key];
          j++;
        }
      }
  
      doc.autoTable({
        body: [
          [{ content: this.routeParam + ' Report', colSpan: 3, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }],
        ],
        theme: 'plain'
      });
      let pipe = new DatePipe('en-US');
      let currentDate = new Date();
  
      let headerRows = [];
      for (var i: number = 0; i < this.tableHeaders.length; i++) {
        headerRows[i] = [];
        let j = 0;
        for (const key in this.tableHeaders[0]) {
          headerRows[i][j] = this.tableHeaders[i][key];
          j++;
        }
      }
  
      headerRows = [
        headerRows[0] ? headerRows[0].concat(headerRows[1]) : "",
        headerRows[2] ? headerRows[2].concat(headerRows[3]) : "",
        headerRows[4] ? headerRows[4].concat(headerRows[5]) : "",
        headerRows[6] ? headerRows[6].concat(headerRows[7]) : "",
        headerRows[8] ? headerRows[8].concat(headerRows[9]) : "",
        headerRows[10] ? headerRows[10].concat(headerRows[11]) : "",
        headerRows[12] ? headerRows[12].concat(headerRows[13]) : "",
        headerRows[14] ? headerRows[14].concat(headerRows[15]) : ""
      ];
  
      headerRows = headerRows.filter(arr => arr != "");
  
  
  
      doc.autoTable({
        margin: { top: 3 },
        columnStyles: {
          1: { halign: 'right' }
        },
        body: headerRows,
        theme: 'plain',
      })
  
      doc.autoTable(columns, rows, { startY: doc.autoTable.previous.finalY + 2, styles: { font: 'Tahoma',fontSize: 10},columnStyles: {0:{cellWidth: 2},1:{cellWidth:3}}, theme: 'plain'});
  
      let footerRows = [];
      for (var i: number = 0; i < this.footerData.length; i++) {
        footerRows[i] = [];
        let j = 0;
        for (const key in this.footerData[0]) {
          footerRows[i][j] = this.footerData[i][key];
          j++;
        }
      }
  
      let updatedFooterRows = [];
  
      if (footerRows && footerRows.length) {
        footerRows.forEach((ft) => {
          let temp = [];
          ft.forEach(data => {
            if (data != "") {
              temp.push(data);
            }
          });
          updatedFooterRows.push(temp);
        })
      }
  
      doc.autoTable({
        body: updatedFooterRows,
        theme: 'plain',
        startY: doc.autoTable.previous.finalY + 2
      })
      doc.save(this.routeParam + 'Report.pdf');
      }
  
else{
  // let doc = new jsPDF('p', 'cm', 'legal');
  let doc = new jsPDF('p', 'in', [1008, 792]); 
  let columns = []; //["ID", "Name", "Country"];
  
  for (const key in this.tableData[0]) {
    columns.push(key);
  }
  let rows = [];
  for (var i: number = 0; i < this.dataSource.filteredData.length; i++) {
    rows[i] = [];
    let j = 0;
    for (const key in this.tableData[0]) {
      rows[i][j] = this.dataSource.filteredData[i][key];
      j++;
    }
  }
  
  doc.autoTable({
    body: [
      [{ content: this.routeParam + ' Report', colSpan: 3, rowSpan: 1, styles: { halign: 'center', fontStyle: 'bold' } }],
    ],
    theme: 'plain'
  });
  
  let pipe = new DatePipe('en-US');
  let currentDate = new Date();

  let headerRows = [];
  for (var i: number = 0; i < this.tableHeaders.length; i++) {
    headerRows[i] = [];
    let j = 0;
    for (const key in this.tableHeaders[0]) {
      headerRows[i][j] = this.tableHeaders[i][key];
      j++;
    }
  }

  headerRows = [
    headerRows[0] ? headerRows[0].concat(headerRows[1]) : "",
    headerRows[2] ? headerRows[2].concat(headerRows[3]) : "",
    headerRows[4] ? headerRows[4].concat(headerRows[5]) : "",
    headerRows[6] ? headerRows[6].concat(headerRows[7]) : "",
    headerRows[8] ? headerRows[8].concat(headerRows[9]) : "",
    headerRows[10] ? headerRows[10].concat(headerRows[11]) : "",
    headerRows[12] ? headerRows[12].concat(headerRows[13]) : "",
    headerRows[14] ? headerRows[14].concat(headerRows[15]) : ""
  ];

  headerRows = headerRows.filter(arr => arr != "");



  doc.autoTable({
    margin: { top: 3 },
    columnStyles: {
      1: { halign: 'right' }
    },
    body: headerRows,
    theme: 'plain',
  })
  

  doc.autoTable(columns, rows, { startY: doc.autoTable.previous.finalY + 1, styles: { font: 'Tahoma',fontSize: 10 }, theme: 'plain'});
  
  doc.addPage();
  var pageCount = doc.internal.getNumberOfPages(); //Total Page Number
  for(i = 0; i < pageCount; i++) { 
  doc.setPage(i); 
  let pageCurrent = doc.internal.getCurrentPageInfo().pageNumber; //Current Page
  doc.setFontSize(10);
  doc.text('page: ' + pageCurrent + '/' + pageCount, 10, 10);
}

  let footerRows = [];
  for (var i: number = 0; i < this.footerData.length; i++) {
    footerRows[i] = [];
    let j = 0;
    for (const key in this.footerData[0]) {
      footerRows[i][j] = this.footerData[i][key];
      j++;
    }
  }
  

  let updatedFooterRows = [];

  if (footerRows && footerRows.length) {
    footerRows.forEach((ft) => {
      let temp = [];
      ft.forEach(data => {
        if (data != "") {
          temp.push(data);
        }
      });
      updatedFooterRows.push(temp);
    })
  }

  doc.autoTable({
    body: updatedFooterRows,
    theme: 'plain',
    startY: doc.autoTable.previous.finalY + 2
  })
  doc.save(this.routeParam + 'Report.pdf');
}
  }
  openDialog(val, row?) {
    if (this.routeParam == 'Shift') {
      this.dateForm.patchValue({
        formDate: this.commonService.formatReportDate(this.dateForm.get('formDate').value),
        toDate: this.commonService.formatReportDate(this.dateForm.get('toDate').value),
        selectedReport: this.dateForm.get('selectedReport').value,
        selectedAccountLedger: this.dateForm.get('selectedAccountLedger').value
      })
      if (this.dateForm.value.selectedReport == "") {
        alert("Please select a shift report type");
        return false;
      }
      else {
        if (this.dateForm.value.fromDate == "") {
          alert("Please select From Date");
          return false;
        }
        else {
          if (this.dateForm.value.toDate == "") {
            alert("Please select To Date");
            return false;
          }
          else {
            let data;
            if (!isNullOrUndefined(row)) {
              data = { action: val, item: row };
              this.highlightedRows = [row];
            } else {
              data = { action: val, item: this.highlightedRows[0] };
            }
            if (data.action === 'Edit' && this.highlightedRows.length) {
              this.params = new HttpParams();
              //params = params.append('UserID',this.user.userName);
              this.params = this.params.append('fromDate', this.dateForm.value.formDate);
              this.params = this.params.append('toDate', this.dateForm.value.toDate);
              this.params = this.params.append('reportID', this.dateForm.value.selectedReport);
              this.params = this.params.append('ledgerCode', this.dateForm.value.selectedAccountLedger);
              this.params = this.params.append('shiftId', data.item.ShiftID)

              let tableUrl = this.reportsService.getRouteUrls('InnerShift');
              const getUrl = String.Join('/', tableUrl.url);
              this.apiService.apiGetRequest(getUrl, this.params)
                .subscribe(
                  response => {
                    let innerReportName = this.Reports[this.dateForm.get('selectedReport').value - 2].reportName;
                    const res = response.body;
                    if (!isNullOrUndefined(res) && res.status === StatusCodes.pass) {
                      if (!isNullOrUndefined(res.response)) {
                        const dialogRef = this.dialog.open(ReportsInnerTableComponent, {
                          width: '1024px',
                          height: '500px',
                          data: { gridData: res.response[tableUrl.listName], reportName: innerReportName, headerData: this.headerData, footerData: this.footerData },
                          panelClass: 'custom-dialog-container',
                          disableClose: true
                        });
                      }
                    }
                  }, error => {

                  });
                  this.spinner.hide();
            }
          }
        }
      }
    }
  }
  highlightRows(row, i) {
    if (this.highlightedRows.length) {
      if (this.index === i) {
        this.highlightedRows = [];
        this.index = null;
      } else {
        this.highlightedRows = [];
        this.highlightedRows.push(row);
        this.index = i;
      }
    } else {
      this.highlightedRows = [];
      this.highlightedRows.push(row);
      this.index = i;
    }
  }

  ngOnChanges() {
    this.columnDefinitions = [];
    this.keys = [];

    if (!isNullOrUndefined(this.tableData)) {
      if (this.tableData.length > 0) {
        this.dataSource = new MatTableDataSource(this.tableData);
      }
    }

    if (!isNullOrUndefined(this.dataSource)) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (!isNullOrUndefined(this.tableData) && this.tableData.length > 0) {

      // tslint:disable-next-line:forin
      for (const key in this.tableData[0]) {
        this.keys.push({ col: key });
      }

      this.keys.forEach(cols => {
        const obj = {
          def: cols.col, label: cols.col, hide: true
        };
        this.columnDefinitions.push(obj);
      });
    }

    console.log(this.columnDefinitions);


    this.generateTableHeaders();

  }
  ngAfterViewInit() {
    // this.multiSelect.open();
    this.cdr.detectChanges();
  }
  ngOnInit() {
    this.getAccountLedgersList();
    this.getReportBranchesList();
    this.getReportPGList();
    this.getReportSGList();
    // this.getProductsList();
  }

  generateTableHeaders() {
    this.tableHeaders = [];
    if (this.headerData && this.headerData.length) {
      this.headerData.forEach((header) => {
        for (let key in header) {
          if (header[key] != "") {
            this.tableHeaders.push({ 'column': header[key] })
          }
        }
      })
    }
  }

  ngOnDestroy() {
    this.tableData = [];
    this.tableHeaders = [];
  }

}
