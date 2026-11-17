
export interface Student {
  id: number;
  name: string;
  email: string;
  registerNumber: string;
  department: string;
  year: number;
  phoneNumber: string;
  createdAt: string;
}

export type StudentPayload = Omit<Student, 'id' | 'createdAt'>;
