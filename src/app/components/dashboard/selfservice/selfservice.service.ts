import { Injectable } from '@angular/core';
import { String } from 'typescript-string-operations';
import { ApiConfigService } from '../../../services/api-config.service';
import { LeavetypeComponent } from './leavetype/leavetype.component';
import { LeaveopeningbalanceComponent } from './leaveopeningbalance/leaveopeningbalance.component';
import { LeaveRequestComponent } from './leaverequest/leaverequest.component';
import { LeaveApprovalComponent } from './leaveapproval/leaveapproval.component';

@Injectable({
  providedIn: 'root'
})
export class selfService {
  dynamicData = { url: '', component: null, registerUrl: '', listName: '', updateUrl: '', primaryKey: '', deleteUrl: '', coustom: true };


  constructor(
    private apiConfigService: ApiConfigService
  ) { }

  getRouteUrls(data) {
    debugger;
    switch (data) {
      case 'leaveopeningbalance':
        this.dynamicData.url = this.apiConfigService.getLeaveopeningbalanceList;
        this.dynamicData.component = LeaveopeningbalanceComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerLeaveopeningbalance;
        this.dynamicData.updateUrl = this.apiConfigService.updateLeaveopeningbalance;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteLeaveopeningbalance;
        this.dynamicData.listName = 'lopList';
        this.dynamicData.primaryKey = 'empCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'Leaverequest':
        const user = JSON.parse(localStorage.getItem('user'));
        this.dynamicData.url = String.Join('/', this.apiConfigService.getLeaveRequestList, user.userName);
        //this.dynamicData.url = this.apiConfigService.getLeaveRequestList,user.userName;
        this.dynamicData.component = LeaveRequestComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerLeaveRequests;
        this.dynamicData.updateUrl = this.apiConfigService.updateLeaveRequests;
        //this.dynamicData.deleteUrl = this.apiConfigService.deleteLeaveTypes;
        this.dynamicData.listName = 'LeaveApplDetailsList';
        this.dynamicData.primaryKey = 'empCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      case 'leaveApproval':
        this.dynamicData.url = this.apiConfigService.getStructuresList;
        this.dynamicData.component = LeaveApprovalComponent;
        // this.dynamicData.registerUrl = this.apiConfigService.registerStructure;
        // this.dynamicData.updateUrl = this.apiConfigService.updateStructure;
        // this.dynamicData.deleteUrl = this.apiConfigService.deleteStructure;
        this.dynamicData.listName = 'structuresList';
        this.dynamicData.primaryKey = 'structureCode';
        this.dynamicData.coustom = false;
        return this.dynamicData;
      case 'leavetype':
        this.dynamicData.url = this.apiConfigService.getLeaveTypeatLists;
        this.dynamicData.component = LeavetypeComponent;
        this.dynamicData.registerUrl = this.apiConfigService.registerLeaveTypes;
        this.dynamicData.updateUrl = this.apiConfigService.updateLeaveTypes;
        this.dynamicData.deleteUrl = this.apiConfigService.deleteLeaveTypes;
        this.dynamicData.listName = 'leavetypeList';
        this.dynamicData.primaryKey = 'leaveCode';
        this.dynamicData.coustom = true;
        return this.dynamicData;
        break;
      default:
    }
  }

}
