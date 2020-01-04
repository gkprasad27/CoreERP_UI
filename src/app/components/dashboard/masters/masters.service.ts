import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
import { CompanyComponent } from './company/company.component';

@Injectable({
  providedIn: 'root'
})
export class MastersService {
  dynamicData = { url: '', component: null };


  constructor(
    private apiConfigService: ApiConfigService
  ) { }

  getRouteUrls(data) {
    switch (data) {
     case 'company':
      this.dynamicData.url = this.apiConfigService.companiesUrl;
      this.dynamicData.component = CompanyComponent;
      return this.dynamicData;
      break;
     case 'branches':
     return this.apiConfigService.branchesUrl;
     break;
     default:
      console.log('no data');
    }
   }

}
