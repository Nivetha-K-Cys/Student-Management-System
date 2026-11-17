
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { StaffDashboard } from './pages/staff-dashboard/staff-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },

  {
    path: 'staff',
    component: StaffDashboard,
    canActivate: [authGuard],
    data: { role: 'Staff' }
  },

  { path: '**', redirectTo: '' }
];
