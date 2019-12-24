import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Event, NavigationEnd, Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);

  constructor(private router: Router, private _snackBar: MatSnackBar) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  private configSucces: MatSnackBarConfig = {
    panelClass: ['style-succes'],
  };

  private configError: MatSnackBarConfig = {
    panelClass: ['style-error'],
  };

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass : ['style-succes']
    });
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }

}
