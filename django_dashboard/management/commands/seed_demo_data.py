from django.core.management.base import BaseCommand
from django_dashboard.models import Classroom, Student, Teacher

class Command(BaseCommand):
    help = 'Seed demo data: 3 classrooms, each with 3 students'

    def handle(self, *args, **kwargs):
        # Create a teacher for each classroom
        for c in range(1, 4):
            teacher = Teacher.objects.create(
                first_name=f"Teacher{c}",
                last_name="Demo",
                email=f"teacher{c}@school.com",
                user_id=f"00000000-0000-0000-0000-00000000000{c}"
            )
            classroom = Classroom.objects.create(
                class_name=f"Classroom {c}",
                teacher=teacher
            )
            for s in range(1, 4):
                Student.objects.create(
                    student_id=f"S{c}{s}",
                    name=f"Student {c}-{s}",
                    grade_level=5,
                    role="student",
                    created_at="2024-05-01T00:00:00Z",
                    updated_at="2024-05-01T00:00:00Z",
                    progress={},
                    user_id=f"10000000-0000-0000-0000-00000000000{c}{s}",
                    email=f"student{c}{s}@school.com",
                    teacher=teacher,
                    classroom=classroom
                )
        self.stdout.write(self.style.SUCCESS('Demo data created!'))
