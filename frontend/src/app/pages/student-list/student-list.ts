import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit {
  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);

  students: Student[] = [];
  keyword = '';
  loading = false;
  error = '';
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('role') === 'Admin';
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.error = '';

    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Unable to load students.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  search(): void {
    if (!this.keyword.trim()) {
      this.loadStudents();
      return;
    }

    this.loading = true;
    this.error = '';

    this.studentService.searchStudents(this.keyword).subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Search failed.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteStudent(id: number): void {
    if (!this.isAdmin) return;

    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.studentService.deleteStudent(id).subscribe({
      next: () => this.loadStudents(),
      error: () => {
        this.error = 'Unable to delete student.';
        this.cdr.markForCheck();
      }
    });
  }
}
