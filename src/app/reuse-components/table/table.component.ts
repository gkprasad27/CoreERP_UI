import { Component, OnInit , ViewChild, AfterViewInit, Input, OnChanges, AfterViewChecked,
   ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatTable } from '@angular/material';
import { Observable, merge } from 'rxjs';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { isNullOrUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteItemComponent } from '../delete-item/delete-item.component';

// search
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  /** control for the selected bank for multi-selection */
  public tableMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public tableMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredTableMulti: ReplaySubject<any> = new ReplaySubject<any>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected onDestroy = new Subject<void>();

  @Input() tableData: any;
  @Input() addOrUpdateData: any;
  @Output() addOrUpdateEvent = new EventEmitter();


  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;
    highlightedRows = [];


  form: FormGroup;
  columnDefinitions = [];
  keys = [];

  constructor(
    private commonService: CommonService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
    ) {}

   highlightRows(row) {
      console.log(row);
      if (this.highlightedRows.length) {
        if (this.highlightedRows[0].code === row.code) {
          this.highlightedRows = [];
        } else {
          this.highlightedRows = [];
          this.highlightedRows.push(row);
        }
      } else {
        this.highlightedRows = [];
        this.highlightedRows.push(row);
      }
   }



   openDialog(val, row?) {
    let data;
    if (!isNullOrUndefined(row)) {
      data = { action : val , item : row };
    } else {
      data = { action : val , item : this.highlightedRows[0] };
    }

    if (data.action === 'Delete' && this.highlightedRows.length) {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      width: '1024px',
      data: this.highlightedRows,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!isNullOrUndefined(result)) {
        this.tableData = this.tableData.filter((value, key) => {
          return value.code !== result.code;
        });
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

    } else if (data.action === 'Edit' && this.highlightedRows.length) {
      this.addOrUpdateEvent.emit(data);
    } else if (data.action === 'Add') {
      data.item = null;
      this.addOrUpdateEvent.emit(data);
    }

  }

  updateRowData(rowObj) {
     for (let t = 0; t < this.tableData.length; t++) {
        if (this.tableData[t].code === rowObj.code) {
          this.tableData[t] = rowObj;
        }
      }
     this.dataSource = new MatTableDataSource(this.tableData);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
  }


  addRowData(rowObj) {
    this.tableData.unshift(rowObj);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.highlightedRows = [];

    if (!isNullOrUndefined(this.addOrUpdateData)) {

     if (this.addOrUpdateData.action === 'Edit') {
       this.updateRowData(this.addOrUpdateData.item);
    } else if (this.addOrUpdateData.action === 'Add') {
      this.addRowData(this.addOrUpdateData.item);
    }

    } else {

    if (!isNullOrUndefined(this.tableData)) {
      this.dataSource = new MatTableDataSource(this.tableData);
    }

    if (!isNullOrUndefined(this.dataSource)) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (!isNullOrUndefined(this.tableData)) {

      // tslint:disable-next-line:forin
      for (const key in this.tableData[0]) {
        this.keys.push({ col : key });
      }

      const group = {};
      this.keys.forEach(cols => {
        group[cols.col] = new FormControl(false);
      });

      this.form = new FormGroup(group);

      this.keys.forEach(cols => {
        const obj = {
          def : cols.col, label: cols.col, hide: this.form.get(cols.col).value
        };
        this.columnDefinitions.push(obj);
      });
    }

    if (!isNullOrUndefined(this.tableData)) {
    this.filteredTableMulti.next(this.columnDefinitions.slice());

    this.tableMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

    }
   }

  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredTableMulti
      .pipe(take(1), takeUntil(this.onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a, b) => a && b && a.def === b.def;
      });
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

  protected filterBanksMulti() {
    if (!this.columnDefinitions) {
      return;
    }
    // get the search keyword
    let search = this.tableMultiFilterCtrl.value;
    if (!search) {
      this.filteredTableMulti.next(this.columnDefinitions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTableMulti.next(
      this.columnDefinitions.filter(bank => bank.def.toLowerCase().indexOf(search) > -1)
    );
  }


  saveChanges() {
    for (let cd = 0; cd < this.keys.length; cd++) {
      this.columnDefinitions[cd].hide = this.form.get(this.keys[cd].col).value;
    }
  }


  // ngAfterViewChecked() {
  //   for (let cd = 0; cd < this.keys.length; cd++) {
  //     this.columnDefinitions[cd].hide = this.form.get(this.keys[cd].col).value;
  //   }
  //  }

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl(false),
    });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getDisplayedColumns(): string[] {
    if (!isNullOrUndefined(this.tableData)) {
    return this.columnDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
    }
  }

}
