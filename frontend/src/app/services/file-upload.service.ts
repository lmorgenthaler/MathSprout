import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Papa, ParseResult } from 'ngx-papaparse';

export interface UploadProgressEvent {
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadProgress = new BehaviorSubject<UploadProgressEvent>({
    status: 'uploading',
    progress: 0
  });

  uploadProgress$ = this.uploadProgress.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private papa: Papa
  ) {
    this.supabaseService.supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
    });
  }

  async uploadFile(file: File): Promise<void> {
    try {
      this.uploadProgress.next({ status: 'uploading', progress: 0 });

      // Upload file to Supabase storage
      const { error } = await this.supabaseService.supabaseClient
        .storage
        .from('classroom-files')
        .upload(`uploads/${file.name}`, file);

      if (error) {
        console.error('Upload error:', error.message, error);
        this.uploadProgress.next({
          status: 'error',
          progress: 0,
          error: `Failed to upload file: ${error.message}`
        });
        throw error;
      }

      this.uploadProgress.next({
        status: 'completed',
        progress: 100
      });
    } catch (error: any) {
      console.error('Unexpected upload error:', error);
      this.uploadProgress.next({
        status: 'error',
        progress: 0,
        error: `Upload failed: ${error.message}`
      });
      throw error;
    }
  }

  private async createStudentAccount(student: {
    firstName: string;
    lastName: string;
    parentEmail: string;
    studentId: string;
  }): Promise<void> {
    const fullName = `${student.firstName} ${student.lastName}`;
    console.log('Creating account for:', fullName);

    // Create auth user first
    const { error: authError } = await this.supabaseService.supabaseClient.auth.signUp({
      email: student.parentEmail,
      password: student.studentId, // Using student ID as password
      options: {
        data: {
          role: 'student',
          student_id: student.studentId,
          first_name: student.firstName,
          last_name: student.lastName
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    // Then create student record
    const { error: dbError } = await this.supabaseService.supabaseClient
      .from('students')
      .insert([
        {
          email: student.parentEmail,
          student_id: student.studentId,
          first_name: student.firstName,
          last_name: student.lastName,
          name: fullName,
          role: 'student'
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
  }
} 