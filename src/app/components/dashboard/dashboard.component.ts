import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input} from '@angular/core';
import { MenuItem } from '../../models/menu';
import { String } from 'typescript-string-operations';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ApiConfigService } from '../../services/api-config.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {


  @ViewChild('appDrawer', {static: false}) appDrawer: ElementRef;
  navItems: MenuItem[] = [
    {
      displayName: 'Master',
      iconName: 'recent_actors',
      route: 'master',
      children: [
        {
          displayName: 'Company',
          iconName: 'group',
          route: 'company'
        },
        {
          displayName: 'Branches',
          iconName: 'speaker_notes',
          route: 'branches'
        },
        {
          displayName: 'Feedback',
          iconName: 'feedback',
          route: 'feedback'
        }
      ]
    },
    {
      displayName: 'Disney',
      iconName: 'videocam',
      route: 'disney',
      children: [
        {
          displayName: 'Speakers',
          iconName: 'group',
          route: 'dashboard/table'
        },
        {
          displayName: 'Sessions',
          iconName: 'speaker_notes',
          route: 'dashboard/table'
        },
        {
          displayName: 'Feedback',
          iconName: 'feedback',
          route: 'feedback'
        }
      ]
    }
  ];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService,
    private apiConfigService: ApiConfigService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    const getMenuUrl = String.Join('/', this.apiConfigService.getMenuUrl);

    this.apiService.apiGetRequest(getMenuUrl)
        .subscribe(
        menu => {
          console.log(menu);
          this.spinner.hide();
          // this.navItems = menu.body;
        });
  }

  ngAfterViewInit() {
    this.commonService.appDrawer = this.appDrawer;
    // console.log(this.navItems);
  }


}
