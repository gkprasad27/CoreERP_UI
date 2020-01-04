import { Injectable } from '@angular/core';
import { Observable, of  } from 'rxjs';

import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public options;

  constructor(
    private http: HttpClient,
    ) {
      this.options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    }


  // get API request
  public apiGetRequest(url: any): Observable<any> {
    return this.http.get(url, { headers: this.options, observe: 'response' })
      .pipe((tap<any>(response => {
        return response.body;
      })),
        catchError(this.handleError('apiGetRequest')));
  }

  // Post API request
  public apiPostRequest(url: any, obj?: any): Observable<any> {
    return this.http.post(url, obj, { headers: this.options, observe: 'response' })
      .pipe((tap<any>(response => {
        return response;
      })),
        catchError(this.handleError('apiPostRequest')));
  }


   // API error handling
   private handleError(operation: string) {
    return (err: HttpErrorResponse) => {
      const errMsg = `error in ${operation}()  status: ${err.status}, ${err.statusText || ''}, ${err} `;
      if (err instanceof HttpErrorResponse) {
        console.log(`status: ${err.status}, ${err.statusText}`);
      }
      // tslint:disable-next-line: deprecation
      return of(err);
    };
  }

}
