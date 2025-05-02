from django.contrib import admin
from .models import (
    Administrator, Subject, Classroom, Teacher, HomeworkAssignment,
    Student, Submission, UsersAdmin, Profile, TeachersBackup
)

admin.site.register(Administrator)
admin.site.register(Subject)
admin.site.register(Classroom)
admin.site.register(Teacher)
admin.site.register(HomeworkAssignment)
admin.site.register(Student)
admin.site.register(Submission)
admin.site.register(UsersAdmin)
admin.site.register(Profile)
admin.site.register(TeachersBackup)
