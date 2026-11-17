
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

  // Feature 2 - Student List (Admin & Staff)
  {
  path: 'students',
  loadComponent: () =>
    import('./pages/student-list/student-list')
      .then(m => m.StudentList),
  canActivate: [authGuard],
  
},

  // Feature 2 - Add Student (Admin Only)
  {
    path: 'students/add',
    loadComponent: () =>
      import('./pages/add-student/add-student')
        .then(m => m.AddStudent),
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },

  // Feature 2 - Edit Student (Admin Only)
  {
    path: 'students/edit/:id',
    loadComponent: () =>
      import('./pages/edit-student/edit-student')
        .then(m => m.EditStudent),
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },

// Feature 3 - Department List (Admin & Staff)
  {
    path: 'departments',
    loadComponent: () =>
      import('./features/departments/department-list/department-list')
        .then(m => m.DepartmentList),
    canActivate: [authGuard]
  },

  // Feature 3 - Add Department (Admin Only)
  {
    path: 'departments/add',
    loadComponent: () =>
      import('./features/departments/department-form/department-form')
        .then(m => m.DepartmentForm),
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },

  // Feature 3 - Edit Department (Admin Only)
  {
    path: 'departments/edit/:id',
    loadComponent: () =>
      import('./features/departments/department-form/department-form')
        .then(m => m.DepartmentForm),
    canActivate: [authGuard],
    data: { role: 'Admin' }
  },
  { path: '**', redirectTo: '' }
];
