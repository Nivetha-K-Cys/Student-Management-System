
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { DepartmentService } from '../../../services/department';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css'
})
export class DepartmentForm implements OnInit {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isEditMode = false;
  departmentId = 0;
  loading = false;
  saving = false;
  errorMessage = '';

  departmentForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    code: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', [Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.departmentId = Number(id);
      this.loadDepartment();
    }
  }

  
loadDepartment(): void {
  this.loading = true;
  this.errorMessage = '';

  this.departmentService.getById(this.departmentId).subscribe({
    next: (department) => {
      this.departmentForm.patchValue({
        name: department.name,
        code: department.code,
        description: department.description || ''
      });

      this.loading = false;
      this.cdr.markForCheck();
    },
    error: (error) => {
      console.error('Department Load Error:', error);
      this.errorMessage =
        error.error?.message || 'Unable to load department.';
      this.loading = false;
      this.cdr.markForCheck();
    }
  });
}

  saveDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const formValue = this.departmentForm.getRawValue();

    const data = {
      name: formValue.name.trim(),
      code: formValue.code.trim().toUpperCase(),
      description: formValue.description.trim() || null
    };

    if (!data.name || !data.code) {
      this.departmentForm.markAllAsTouched();
      this.errorMessage = 'Name and code are required.';
      this.saving = false;
      return;
    }

    if (this.isEditMode) {
      this.departmentService.update(this.departmentId, data).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/departments']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message ||
            'Unable to update department.';
          this.saving = false;
        }
      });
    } else {
      this.departmentService.add(data).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/departments']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message ||
            'Unable to add department.';
          this.saving = false;
        }
      });
    }
  }
}
