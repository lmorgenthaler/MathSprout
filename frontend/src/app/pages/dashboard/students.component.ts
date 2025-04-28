import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Student {
  name: string;
  email: string;
  student_id: string;
  grade_level: string;
  progress: {
    games_played: number;
    average_score: number;
    time_spent: number;
  };
  classroom_id?: number;
  teacher_id?: number;
  classroom?: {
    name: string;
  };
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  teachers: any[] = [];
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
    private fb: FormBuilder,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      student_id: ['', Validators.required],
      grade_level: ['', Validators.required],
      teacher_id: ['', Validators.required],
      classroom_id: [null]
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

  async loadTeachers() {
    try {
      const { data: teachers, error } = await this.supabaseService.getTeachers();
      if (error) {
        console.error('Error loading teachers:', error);
        return;
      }
      this.teachers = teachers || [];
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  }

  async loadClassrooms() {
    try {
      const { data: classrooms, error } = await this.supabaseService.getClassrooms();
      if (error) {
        console.error('Error loading classrooms:', error);
        return;
      }
      this.classrooms = classrooms || [];
    } catch (error) {
      console.error('Error loading classrooms:', error);
    }
  }

  async loadStudents() {
    try {
      const { data: students, error } = await this.supabaseService.getStudents();
      if (error) {
        console.error('Error loading students:', error);
        return;
      }
      this.students = students || [];
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      // Don't navigate here, let the signOut method handle it
    } catch (error) {
      console.error('Error logging out:', error);
      this.error = 'Error logging out. Please try again.';
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
      email: student.email,
      student_id: student.student_id,
      grade_level: student.grade_level,
      teacher_id: student.teacher_id,
      classroom_id: student.classroom_id
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
        const { error } = await this.supabaseService.updateStudent(this.selectedStudent.student_id, formData);
        if (error) {
          console.error('Error updating student:', error);
          return;
        }
      } else {
        const { error } = await this.supabaseService.createStudent(formData);
        if (error) {
          console.error('Error creating student:', error);
          return;
        }
      }
      this.showModal = false;
      this.loadStudents();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  }

  async deleteStudent(student: Student) {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        const { error } = await this.supabaseService.deleteStudent(student.student_id);
        if (error) {
          console.error('Error deleting student:', error);
          return;
        }
        this.loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  }
} 