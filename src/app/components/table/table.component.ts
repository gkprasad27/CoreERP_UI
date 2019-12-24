import { Component, OnInit , ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Observable, merge } from 'rxjs';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { TableDialogBoxComponent } from '../table-dialog-box/table-dialog-box.component';
import { isNullOrUndefined } from 'util';


class Todo {
  id: string;
  description: string;
  complete: boolean;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() tableData: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['code', 'address1', 'address2', 'address3', 'address4', 'email', 'ext1', 'ext2',
                      'finacialYear', 'fromMonth', 'gstno', 'name', 'natureOfBusiness', 'panNo', 'phone1',
  'phone2', 'phone3', 'pinCode', 'place', 'state', 'tanNo', 'toMonth', 'ext3',  'ext4'];
  form: FormGroup;

  constructor(
    private commonService: CommonService,
    public dialog: MatDialog
    ) {
   }

  ngOnChanges() {
    if (!isNullOrUndefined(this.tableData)) {
      this.dataSource = new MatTableDataSource(this.tableData);
    }
    if (!isNullOrUndefined(this.tableData)) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnInit() {

    this.form = new FormGroup({
      id: new FormControl(false),
      description: new FormControl(false)
    });
    

  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.commonService.openSnackBar('filter', 'close');
  }

  ngAfterViewInit() {
    // const o1: Observable<boolean> = this.id.valueChanges;
    // const o2: Observable<boolean> = this.description.valueChanges;

    // merge(o1, o2).subscribe( v => {
    // this.columnDefinitions[0].hide = this.id.value;
    // this.columnDefinitions[1].hide = this.description.value;
    //  });
   }




  // id = this.form.get('id');
  // description = this.form.get('description');
  // columnDefinitions = [
  //   { def: 'id', label: 'ID', hide: this.id.value},
  //   { def: 'description', label: 'Description', hide: this.description.value}
  // ];

}
