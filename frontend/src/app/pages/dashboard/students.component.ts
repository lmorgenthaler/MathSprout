import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { StudentService } from '../../services/student.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

interface Student {
  id: number;
  name: string;
  email: string;
  teacher_id: number;
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

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
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
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async ngOnInit() {
    try {
      this.isLoading = true;
      await this.loadTeacherAndClassrooms();
      
      if (!this.currentTeacher) {
        // Wait a bit for the teacher to be created
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.loadTeacherAndClassrooms();
        
        if (!this.currentTeacher) {
          this.error = 'No teacher found. Please make sure you are logged in as a teacher.';
          return;
        }
      }
      
      await this.loadStudents();
    } catch (err) {
      console.error('Error in ngOnInit:', err);
      this.error = 'Error loading data. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  async loadTeacherAndClassrooms() {
    try {
      this.currentTeacher = await this.supabaseService.getCurrentTeacher();
      console.log('Current teacher:', this.currentTeacher);
      
      if (this.currentTeacher) {
        this.classrooms = await this.supabaseService.getTeacherClassrooms(this.currentTeacher.teacher_id);
        console.log('Classrooms:', this.classrooms);
      }
    } catch (err) {
      console.error('Error loading teacher and classrooms:', err);
      throw err;
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
    this.studentForm.patchValue({
      first_name: student.name.split(' ')[0],
      last_name: student.name.split(' ')[1],
      email: student.email
    });
    this.isEditMode = true;
    this.selectedStudent = student;
    this.showModal = true;
  }

  async saveStudent() {
    if (this.studentForm.invalid) {
      return;
    }

    try {
      const formData = this.studentForm.value;
      if (this.isEditMode && this.selectedStudent) {
        const updatedStudent = await this.studentService.updateStudent(this.selectedStudent.id, {
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email
        });
        const index = this.students.findIndex(s => s.id === updatedStudent.id);
        if (index !== -1) {
          this.students[index] = updatedStudent;
        }
        this.showModal = false;
      } else {
        // Generate a student ID (timestamp + random number)
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const student_id = `S${timestamp}${random}`;
        
        const student = await this.studentService.createStudent({
          student_id,
          name: `${formData.first_name} ${formData.last_name}`,
          email: formData.email,
          role: 'student'
        });
        this.students.push(student);
        this.showModal = false;
      }
    } catch (error) {
      console.error('Error saving student:', error);
      this.error = 'Failed to save student. Please try again later.';
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
    this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
} 