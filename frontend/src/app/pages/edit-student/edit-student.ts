
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student';
import { StudentPayload } from '../../models/student';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-student.html',
  styleUrl: './edit-student.css'
})
export class EditStudent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  id = 0;
  loading = true;
  saving = false;
  error = '';

  student: StudentPayload = {
    name: '',
    email: '',
    registerNumber: '',
    department: '',
    year: 1,
    phoneNumber: ''
  };

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      this.error = 'Invalid student ID.';
      this.loading = false;
      return;
    }

    this.studentService.getStudentById(this.id).subscribe({
      next: (data) => {
        this.student = {
          name: data.name,
          email: data.email,
          registerNumber: data.registerNumber,
          department: data.department,
          year: data.year,
          phoneNumber: data.phoneNumber
        };
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Student not found.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  updateStudent(): void {
    this.saving = true;
    this.error = '';

    this.studentService.updateStudent(this.id, this.student).subscribe({
      next: () => this.router.navigate(['/students']),
      error: (err) => {
        this.error = err.error?.message || 'Update failed.';
        this.saving = false;
      }
    });
  }
}
