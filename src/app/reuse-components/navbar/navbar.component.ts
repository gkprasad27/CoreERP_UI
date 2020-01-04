import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() showExpandButton = true;
  @Input() showInfoIcon = false;
  loginUser: any;

  constructor(
    public commonService: CommonService
  ) { }

  ngOnInit() {
    this.loginUser = JSON.parse(localStorage.getItem('user'));
  }


}
