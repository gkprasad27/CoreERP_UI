import { Injectable } from '@angular/core';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  loginUrl: string;
  companiesUrl: string;
  branchesUrl: string;
  getMenuUrl: string;

  constructor(private environment: RuntimeConfigService) {
    environment.loadRuntimeConfig().subscribe(res => {
      this.apiList(res.body.serverUrl);
    });
  }

  apiList(url) {
    this.loginUrl = `${url}api/Auth/login`;
    this.companiesUrl = `${url}api/Company/masters/companies`;
    this.branchesUrl = `${url}api/Branches/masters/branches`;
    this.getMenuUrl = `${url}api/Auth/getMenu/admin`;
    console.log(this.companiesUrl);

  }
}
