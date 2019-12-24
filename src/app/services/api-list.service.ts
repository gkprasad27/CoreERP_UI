import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiListService {

  public baseUrl = environment.baseUrl;

  public tableData = `${this.baseUrl}/api/Company/masters/companies`;



  constructor() { }
}
