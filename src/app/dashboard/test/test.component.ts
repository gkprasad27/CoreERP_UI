import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ApiListService } from '../../services/api-list.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  tableData: any;

  constructor(
    private apiService: ApiService,
    private apiListService: ApiListService
  ) { }

  ngOnInit() {
    this.apiService.getMethod().subscribe(res => {
      console.log(res);
      this.tableData = res.companies;
    });
  }

}
