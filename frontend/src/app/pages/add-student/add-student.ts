
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../../services/student';
import { StudentPayload } from '../../models/student';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css'
})
export class AddStudent {
  private studentService = inject(StudentService);
  private router = inject(Router);

  student: StudentPayload = {
    name: '',
    email: '',
    registerNumber: '',
    department: '',
    year: 1,
    phoneNumber: ''
  };

  saving = false;
  error = '';

  saveStudent(): void {
    this.saving = true;
    this.error = '';

    this.studentService.addStudent(this.student).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Unable to add student.';
        this.saving = false;
      }
    });
  }
}
