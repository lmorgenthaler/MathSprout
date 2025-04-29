import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Student {
  id: number;
  name: string;
  email: string;
  role: string;
  student_id: string;
  teacher_id: number;
  classroom_id?: number;
  classroom?: {
    name: string;
  };
  progress?: {
    games_played: number;
    average_score: number;
    time_spent: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateStudentDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  parentEmail: string;
  grade: number;
  classroom: string;
  student_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.apiUrl;
  private currentTeacher: any = null;

  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService
  ) {
    this.initializeTeacher();
  }

  private async initializeTeacher() {
    try {
      this.currentTeacher = await this.supabaseService.getCurrentTeacher();
      if (!this.currentTeacher) {
        throw new Error('No teacher found');
      }
    } catch (error) {
      console.error('Error initializing teacher:', error);
      throw error;
    }
  }

  async getStudents(): Promise<Student[]> {
    try {
      const teacher = await this.supabaseService.getCurrentTeacher();
      if (!teacher || !teacher.teacher_id) {
        console.error('No teacher found or teacher ID is missing');
        return [];
      }

      console.log('Fetching students for teacher:', teacher.teacher_id);

      const { data, error } = await this.supabaseService.supabaseClient
        .from('students')
        .select('*')
        .eq('teacher_id', teacher.teacher_id);

      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  }

  async createStudent(studentData: CreateStudentDto): Promise<Student> {
    try {
      const teacher = await this.supabaseService.getCurrentTeacher();
      if (!teacher || !teacher.teacher_id) {
        throw new Error('No teacher found or teacher ID is missing');
      }

      // 1. Try to find (or create) classroom
      const classroomId = await this.getOrCreateClassroom(studentData.classroom, teacher.teacher_id);

      // 2. Create the auth user first through Django backend
      const payload = {
        email: studentData.email,
        password: studentData.password,
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        parent_email: studentData.parentEmail,
      };

      console.log('🔥 Sending payload to backend:', payload);

      const response = await this.http.post<any>(`${this.apiUrl}/create-student/`, payload).toPromise();

      if (!response || !response.user_id) {
        throw new Error('Invalid response from backend');
      }

      // 3. Insert into students table
      const { data, error } = await this.supabaseService.supabaseClient
        .from('students')
        .insert({
          user_id: response.user_id,
          teacher_id: teacher.teacher_id,
          name: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.email,
          grade_level: studentData.grade,
          role: 'student',
          progress: {},
          classroom_id: classroomId,
          student_id: studentData.student_id || ''
        })
        .select()
        .single();

        
      if (error) {
        console.error('Error creating student in Supabase:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createStudent:', error);
      throw error;
    }
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

  private async getOrCreateClassroom(className: string, teacherId: number): Promise<number> {
    const { data: existingClassroom, error: fetchError } = await this.supabaseService.supabaseClient
      .from('Classroom')
      .select('classroom_id')
      .eq('class_name', className)
      .eq('teacher_id', teacherId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking for existing classroom:', fetchError);
      throw new Error('Failed to check for existing classroom.');
    }

    if (existingClassroom) {
      console.log('Found existing classroom:', existingClassroom);
      return existingClassroom.classroom_id;
    }

    const { data: newClassroom, error: createError } = await this.supabaseService.supabaseClient
      .from('Classroom')
      .insert({
        class_name: className,
        teacher_id: teacherId,
      })
      .select('classroom_id')
      .single();

    if (createError) {
      console.error('Error creating new classroom:', createError);
      throw new Error('Failed to create new classroom.');
    }

    console.log('Created new classroom:', newClassroom);
    return newClassroom.classroom_id;
  }
}
