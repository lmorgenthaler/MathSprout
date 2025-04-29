import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { StudentService, CreateStudentDto } from '../../services/student.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Student {
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

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  classrooms: any[] = [];
  currentTeacher: any = null;
  showModal = false;
  isEditMode = false;
  selectedStudent: Student | null = null;
  studentForm: FormGroup;
  isLoading = true;
  error: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private studentService: StudentService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      student_id: ['', Validators.required],
      parent_email: ['', [Validators.required, Validators.email]],
      grade: ['', Validators.required],
      classroom: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.currentTeacher = await this.supabaseService.getCurrentTeacher();
      if (!this.currentTeacher) {
        this.error = 'No teacher found. Please log in again.';
        return;
      }
      await this.loadStudents();
    } catch (error) {
      console.error('Error initializing component:', error);
      this.error = 'Failed to load data. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async loadStudents() {
    try {
      this.students = await this.studentService.getStudents();
    } catch (error) {
      console.error('Error loading students:', error);
      this.error = 'Failed to load students. Please try again later.';
    }
  }

  openAddStudentModal() {
    this.studentForm.reset();
    this.isEditMode = false;
    this.selectedStudent = null;
    this.showModal = true;
  }

  openEditStudentModal(student: Student) {
    this.selectedStudent = student;
    this.studentForm.patchValue({
      first_name: student.name.split(' ')[0],
      last_name: student.name.split(' ')[1],
      email: student.email,
      student_id: student.student_id,
      parent_email: '',
      grade: '',
      classroom: student.classroom?.name || ''
    });
    this.isEditMode = true;
    this.showModal = true;
  }

  saveStudent() {
    if (this.studentForm.valid) {
      const formData = this.studentForm.value;
  
      const studentData = {
        email: formData.email,
        password: formData.student_id, // Use student_id as password
        firstName: formData.first_name,
        lastName: formData.last_name,
        parentEmail: formData.parent_email,
        student_id: formData.student_id,
        grade: formData.grade,
        classroom: formData.classroom,
        role: 'student'
      };
  
      console.log('🔥 Sending correct studentData to service:', studentData);
  
      this.studentService.createStudent(studentData)
        .then(() => {
          this.showModal = false;
          this.loadStudents();
          this.studentForm.reset();
        })
        .catch((error: Error) => {
          console.error('Error creating student:', error);
          this.error = 'Failed to create student. Please try again.';
        });
    }
  }

  async deleteStudent(student: Student) {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await this.studentService.deleteStudent(student.id);
        this.students = this.students.filter(s => s.id !== student.id);
      } catch (error) {
        console.error('Error deleting student:', error);
        this.error = 'Failed to delete student. Please try again later.';
      }
    }
  }

  logout() {
    this.supabaseService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
} 