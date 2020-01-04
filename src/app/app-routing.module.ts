import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent , NotFoundComponent , DashboardComponent} from './components/index';
import { CompanyComponent , MastersComponent } from './components/dashboard/masters/index';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard', canActivate: [AuthGuard] } ,
    children : [
    { path: 'master/:id', component: MastersComponent, data: { title: 'test' }
    },
  ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent, data: { title: 'Page Not Found' } },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
