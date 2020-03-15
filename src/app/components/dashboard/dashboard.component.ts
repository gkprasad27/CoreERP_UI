import {Component, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, Input} from '@angular/core';
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
  navItems = [
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
          displayName: 'Division',
          iconName: 'feedback',
          route: 'division'
        },
        {
          displayName: 'Segment',
          iconName: 'feedback',
          route: 'segment'
        },
        {
          displayName: 'ProfitCenter',
          iconName: 'feedback',
          route: 'profitCenter'
        },
        {
          displayName: 'PartnerCreation',
          iconName: 'feedback',
          route: 'partnerCreation'
        },
        {
          displayName: 'CostCenter',
          iconName: 'feedback',
          route: 'costCenter'
        },
        {
          displayName: 'NoSeries',
          iconName: 'feedback',
          route: 'noSeries'
        },
        {
          displayName: 'PartnerType',
          iconName: 'feedback',
          route: 'partnerType'
        },
        {
          displayName: 'EmployeeInBranch',
          iconName: 'feedback',
          route: 'employeeInBranch'
        },
        {
          displayName: 'Employee',
          iconName: 'feedback',
          route: 'employee'
        },
        {
          displayName: 'TaxMaster',
          iconName: 'feedback',
          route: 'taxMaster'
        },
      ]
    },
    {
      displayName: 'Sales',
      iconName: 'videocam',
      route: 'sales',
      children: [
        {
          displayName: 'Bill Receivable Branch',
          iconName: 'group',
          route: 'asnBillsRcvBranch'
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
        },
        {
          displayName: 'CardType',
          iconName: 'feedback',
          route: 'cardType'
        }
      ]
    },
    {
      displayName: 'GeneralLedger',
      iconName: 'recent_actors',
      route: 'generalledger',
      children: [
        {
          displayName: 'AccountsGroup',
          iconName: 'account_balance',
          route: 'accountsgroup'
        },
        {
          displayName: 'SubGroup',
          iconName: 'group',
          route: 'subgroup'
        },
        {
          displayName: 'UnderSubgroup',
          iconName: 'group',
          route: 'undersubgroup'
        },
        {
          displayName: 'GLAccounts',
          iconName: 'group',
          route: 'glaccounts'
        },
        {
          displayName: 'GLSubcode',
          iconName: 'group',
          route: 'glsubcode'
        },
        {
          displayName: 'TaxIntegration',
          iconName: 'group',
          route: 'taxintegration'
        },
        {
          displayName: 'CashAccToBranches',
          iconName: 'group',
          route: 'cashacctobranches'
        },
        {
          displayName: 'AccToAccClass',
          iconName: 'group',
          route: 'acctoaccclass'
        },
        {
          displayName: 'VoucherTypes',
          iconName: 'group',
          route: 'vouchertypes'
        }
      ]
    },
    {
      displayName: 'Reports',
      iconName: 'recent_actors',
      route: 'reports',
      children: [
        // {
        //   displayName: 'Bonus',
        //   iconName: 'account_balance',
        //   route: 'bonus'
        // },
        // {
        //   displayName:'Member Master',
        //   iconName:'account_balance',
        //   route:'membermaster'
        // },
        // {
        //   displayName:"Employee Register",
        //   iconName:'account_balance',
        //   route:'employeeregister'
        // },
        {
          displayName:"Account Ledger",
          iconName:'account_balance',
          route:'AccountLedger'
        },
        {
          displayName:"24Hrs Sale Value",
          iconName:'monetization_on',
          route:'24HrsSaleValue'
        },
        {
          displayName:"24Hrs sales stock",
          iconName:"timeline",
          route:"24HrsSalesStock"
        },
        {
          displayName:"Shift Reports",
          iconName:'schedule',
          route:'Shift'
        },
        {
          displayName:"Vehical Report",
          iconName:'commute',
          route:'Vehical'
        },
        {
          displayName:"Intimate Sale Report",
          iconName:"euro_symbol",
          route:"Intimate Sale"
        },
        // {
        //   displayName:"Sales GST Report",
        //   iconName:"account_balance",
        //   route:"Sales GST"
        // },
        // {
        //   displayName:"Daily Sales Report",
        //   iconName:"account_balance",
        //   route:"Daily Sales"
        // },
        {
          displayName:"Stock Verification Report",
          iconName:"ev_station",
          route:"Stock Verification"
        },
        {
          displayName:"Stock Ledger For All Products",
          iconName:"track_changes",
          route:"Stock Ledger"
        },
        {
          displayName:"Sales analysis by branch",
          iconName:"score",
          route:"Sales analysis by branch"
        },
        {
          displayName:"Product Wise Monthly Purchase",
          iconName:"category",
          route:"Product Wise Monthly Purchase"
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
