from django.db import models

# Create your models here.

class Administrator(models.Model):
    id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    password = models.BigIntegerField()
    email = models.TextField()

class Subject(models.Model):
    subject_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

class Classroom(models.Model):
    classroom_id = models.BigAutoField(primary_key=True)
    class_name = models.TextField()
    teacher = models.ForeignKey('Teacher', on_delete=models.SET_NULL, null=True)

class Teacher(models.Model):
    teacher_id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.TextField()
    user_id = models.UUIDField()

class HomeworkAssignment(models.Model):
    assignment_id = models.BigAutoField(primary_key=True)
    assignment_title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)

class Student(models.Model):
    id = models.BigAutoField(primary_key=True)
    student_id = models.TextField()
    name = models.CharField(max_length=255)
    grade_level = models.IntegerField()
    role = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    progress = models.JSONField()
    user_id = models.UUIDField()
    email = models.TextField()
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True)

class Submission(models.Model):
    submission_id = models.BigAutoField(primary_key=True)
    assignment = models.ForeignKey(HomeworkAssignment, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    submission_date = models.DateTimeField()
    accuracy_average = models.FloatField()
    submission_grade = models.FloatField()

class UsersAdmin(models.Model):
    admin_id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.TextField()
    department = models.TextField()
    password = models.DecimalField(max_digits=20, decimal_places=0)

class Profile(models.Model):
    id = models.UUIDField(primary_key=True)
    updated_at = models.DateTimeField()
    username = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    avatar_url = models.TextField()
    website = models.TextField()
    role = models.TextField()

class TeachersBackup(models.Model):
    teacher_id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.TextField()
    user_id = models.UUIDField()
