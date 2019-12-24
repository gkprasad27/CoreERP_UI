import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    ) { }

    getMethod(): Observable<any> {

      return this.http.get(`http://183.82.48.82:89/api/Company/masters/companies`)
      .pipe(
        map(res => {
          return res;
        }), catchError(this.handleError)

      );

    }

  handleError(error) {
    let errorMessage = '';
    if (error instanceof HttpResponse) {
    }
    return errorMessage;
  }

}
