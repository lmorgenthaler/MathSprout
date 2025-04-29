import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<any>(null);
  private sessionSubject = new BehaviorSubject<Session | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Check for existing session
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      this.userSubject.next(session?.user ?? null);
      this.sessionSubject.next(session);
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.userSubject.next(session?.user ?? null);
      this.sessionSubject.next(session);
    });
  }

  // Get current user
  get user() {
    return this.userSubject.asObservable();
  }

  // Get current user synchronously
  getCurrentUser() {
    return this.userSubject.value;
  }

  // Get Supabase client
  get supabaseClient() {
    return this.supabase;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, options?: { data?: any }): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          ...options,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            ...options?.data,
            email_confirmed_at: new Date().toISOString() // Auto-confirm email for now
          }
        }
      });

      if (error) throw error;

      // Wait for auth state to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { 
        user: data.user, 
        session: data.session, 
        error: null 
      };
    } catch (error) {
      console.error('SignUp error:', error);
      return {
        user: null,
        session: null,
        error: error as Error
      };
    }
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email,
    });
    return { error };
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error: error ? new Error(error.message) : null };
  }

  // Sign in with Google
  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: environment.redirectUri,
        queryParams: {
          client_id: environment.googleClientId
        }
      }
    });
    if (error) throw error;
    return data;
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      // Clear any stored data
      this.userSubject.next(null);
      // Redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async updateUser(options: { data?: any; password?: string }): Promise<{ user: User | null; error: any }> {
    const { data, error } = await this.supabase.auth.updateUser(options);
    return { user: data.user, error };
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  }

  async getCurrentTeacher() {
    try {
      console.log('Getting current user...');
      const user = await this.getUser();
      if (!user) {
        console.error('No user found');
        return null;
      }
      console.log('Current user:', user);

      // First try to get the teacher
      console.log('Fetching existing teacher record...');
      const { data: existingTeachers, error: fetchError } = await this.supabase
        .from('teachers')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error fetching teacher:', fetchError);
        return null;
      }

      if (!existingTeachers || existingTeachers.length === 0) {
        console.log('Teacher not found, creating new teacher record...');
        const { data: newTeacher, error: createError } = await this.supabase
          .from('teachers')
          .insert([
            {
              user_id: user.id,
              first_name: user.user_metadata?.['name']?.split(' ')[0] || user.email?.split('@')[0] || 'Teacher',
              last_name: user.user_metadata?.['name']?.split(' ')[1] || '',
              email: user.email
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating teacher:', createError);
          return null;
        }

        console.log('Successfully created new teacher:', newTeacher);
        return newTeacher;
      }

      // If multiple teachers exist, take the first one
      const teacher = existingTeachers[0];
      console.log('Found existing teacher:', teacher);
      return teacher;
    } catch (error) {
      console.error('Error in getCurrentTeacher:', error);
      return null;
    }
  }

  async getTeacherClassrooms(teacherId: number) {
    const { data, error } = await this.supabase
      .from('Classroom')
      .select('*')
      .eq('teacher_id', teacherId);

    if (error) {
      console.error('Error fetching classrooms:', error);
      return [];
    }

    return data;
  }

  async getStudentsByTeacher(teacherId: number) {
    try {
      // First try to fetch with classroom join
      const { data, error } = await this.supabase
        .from('students')
        .select(`
          *,
          Classroom (
            classroom_id,
            name
          )
        `)
        .eq('teacher_id', teacherId);

      if (error) {
        console.warn('Error fetching students with classroom:', error);
        
        // Fall back to fetching just students without classroom join
        const { data: studentsOnly, error: studentsError } = await this.supabase
          .from('students')
          .select('*')
          .eq('teacher_id', teacherId);

        if (studentsError) {
          console.error('Error fetching students:', studentsError);
          return [];
        }

        // Add empty classroom data to maintain consistent structure
        return studentsOnly.map(student => ({
          ...student,
          Classroom: null
        }));
      }

      return data;
    } catch (error) {
      console.error('Error in getStudentsByTeacher:', error);
      return [];
    }
  }

  async createClassroom(name: string, gradeLevel: string) {
    const teacher = await this.getCurrentTeacher();
    if (!teacher) {
      throw new Error('No teacher found');
    }

    const { data, error } = await this.supabase
      .from('Classroom')
      .insert({
        name,
        grade_level: gradeLevel,
        teacher_id: teacher.teacher_id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating classroom:', error);
      throw error;
    }

    return data;
  }

  async updateStudentClassroom(studentId: string, classroomId: number) {
    const { error } = await this.supabase
      .from('students')
      .update({ classroom_id: classroomId })
      .eq('student_id', studentId);

    if (error) {
      console.error('Error updating student classroom:', error);
      throw error;
    }
  }

  async getTeachers() {
    return this.supabaseClient
      .from('teachers')
      .select('*');
  }

  async getClassrooms() {
    return this.supabaseClient
      .from('classrooms')
      .select('*');
  }

  async getStudents() {
    return this.supabaseClient
      .from('students')
      .select('*');
  }

  async createStudent(studentData: any) {
    try {
      const session = await this.supabase.auth.getSession();
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session?.access_token}`
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create student');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(studentId: string, studentData: any) {
    return this.supabaseClient
      .from('students')
      .update(studentData)
      .eq('student_id', studentId);
  }

  async deleteStudent(studentId: string) {
    return this.supabaseClient
      .from('students')
      .delete()
      .eq('student_id', studentId);
  }

  getSession(): Session | null {
    return this.sessionSubject.value;
  }
} 