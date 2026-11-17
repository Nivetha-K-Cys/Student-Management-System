
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Department,
  CreateDepartment,
  UpdateDepartment
} from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5179/api/departments';

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  search(keyword: string): Observable<Department[]> {
    return this.http.get<Department[]>(
      `${this.apiUrl}/search`,
      { params: { keyword } }
    );
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  add(department: CreateDepartment): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  update(id: number, department: UpdateDepartment): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
