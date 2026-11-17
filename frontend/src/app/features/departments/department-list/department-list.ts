
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { DepartmentService } from '../../../services/department';
import { Department } from '../../../models/department';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css'
})
export class DepartmentList implements OnInit {
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  departments: Department[] = [];
  searchKeyword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Adjust this to match your existing auth storage.
get isAdmin(): boolean {
  return this.auth.getRole()?.toLowerCase() === 'admin';
}
  ngOnInit(): void {
    this.loadDepartments();
  }

 
loadDepartments(): void {
  this.loading = true;
  this.errorMessage = '';

  this.departmentService.getAll().subscribe({
    next: (data) => {
      this.departments = data;
      this.loading = false;
      this.cdr.markForCheck();
    },
    error: (error) => {
      console.error('Department API Error:', error);
      this.errorMessage = 'Failed to load departments';
      this.loading = false;
      this.cdr.markForCheck();
    }
  });
}


  searchDepartments(): void {
    const keyword = this.searchKeyword.trim();

    if (!keyword) {
      this.loadDepartments();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.departmentService.search(keyword).subscribe({
      next: (data) => {
        this.departments = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Search failed.';
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.loadDepartments();
  }

  addDepartment(): void {
    if (this.isAdmin) {
      this.router.navigate(['/departments/add']);
    }
  }

  editDepartment(id: number): void {
    if (this.isAdmin) {
      this.router.navigate(['/departments/edit', id]);
    }
  }

  deleteDepartment(id: number): void {
    if (!this.isAdmin) return;

    const confirmed = confirm(
      'Are you sure you want to delete this department?'
    );

    if (!confirmed) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.departmentService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Department deleted successfully.';
        this.loadDepartments();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          'Unable to delete department.';
      }
    });
  }
}
