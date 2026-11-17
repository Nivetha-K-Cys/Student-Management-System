export interface Department {
  id: number;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
}

export interface CreateDepartment {
  name: string;
  code: string;
  description: string | null;
}

export interface UpdateDepartment {
  name: string;
  code: string;
  description: string | null;
}