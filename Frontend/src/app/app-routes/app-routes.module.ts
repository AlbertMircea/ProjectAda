import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MainPageComponent } from '../main-page/main-page.component'; 
import { PacientComponent } from '../pacient/pacient.component';
import { RegisterComponent } from '../register/register.component';
import { ViewMedicationComponent } from '../medication/view-medication/view-medication.component';
import { RequestMedicationComponent } from '../medication/request-medication/request-medication.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainPageComponent },
  { path: 'patients', component: PacientComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'view-medication/:userId', component: ViewMedicationComponent },
  { path: 'medication-requests', component: RequestMedicationComponent }
];
