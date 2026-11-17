
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentPayload } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5179/api/students';

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  addStudent(data: StudentPayload): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, data);
  }

  updateStudent(id: number, data: StudentPayload): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteStudent(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchStudents(keyword: string): Observable<Student[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Student[]>(`${this.apiUrl}/search`, { params });
  }
}
