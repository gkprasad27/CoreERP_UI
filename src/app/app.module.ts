import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedImportModule } from './shared/shared-import';

import { NavbarComponent , TableComponent, DeleteItemComponent } from './reuse-components/index';
import { CompanyComponent , MastersComponent } from './components/dashboard/masters/index';
import { LoginComponent , NotFoundComponent,
         SidebarComponent , DashboardComponent
        } from './components/index';

import { RuntimeConfigService } from './services/runtime-config.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    NotFoundComponent,
    SidebarComponent,
    MastersComponent,
    CompanyComponent,
    TableComponent,
    DeleteItemComponent,
    DashboardComponent
  ],
  imports: [
    AppRoutingModule,
    SharedImportModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    RuntimeConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (environment: RuntimeConfigService) => () => environment.loadRuntimeConfig(),
      multi: true,
      deps: [RuntimeConfigService, HttpClientModule]
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ DeleteItemComponent, CompanyComponent ]
})
export class AppModule { }
