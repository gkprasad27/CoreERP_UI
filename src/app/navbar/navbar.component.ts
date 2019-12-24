import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../services/common.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() showImage: any;
  @Input() showExpandButton: any;

  constructor(
    public commonService: CommonService
  ) { }

  ngOnInit() {
  }

}
