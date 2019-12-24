import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SharedModule } from './shared/shared.module';
import { DashboardComponent , NavbarComponent, SidebarComponent } from './index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableComponent } from './components/table/table.component';
import { TableDialogBoxComponent } from './components/table-dialog-box/table-dialog-box.component';
import { TestComponent } from './dashboard/test/test.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    TableDialogBoxComponent,
    TestComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ TableDialogBoxComponent ]
})
export class AppModule { }
