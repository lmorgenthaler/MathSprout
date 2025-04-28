import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Student {
  id: number;
  student_id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  teacher_id: number;
  role: string;
  created_at: string;
  classroom_id?: number;
  classroom?: {
    name: string;
  };
  progress?: {
    games_played: number;
    average_score: number;
    time_spent: number;
  };
}

export interface CreateStudentDto {
  student_id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private supabaseService: SupabaseService) { }

  async getStudents(): Promise<Student[]> {
    const teacher = await this.supabaseService.getCurrentTeacher();
    return this.supabaseService.getStudentsByTeacher(teacher.teacher_id);
  }

  async createStudent(student: CreateStudentDto): Promise<Student> {
    const teacher = await this.supabaseService.getCurrentTeacher();
    const { data, error } = await this.supabaseService.supabaseClient
      .from('students')
      .insert([{ ...student, teacher_id: teacher.teacher_id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateStudent(id: number, student: { name: string, email: string }): Promise<Student> {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('students')
      .update(student)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteStudent(id: number): Promise<void> {
    const { error } = await this.supabaseService.supabaseClient
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 