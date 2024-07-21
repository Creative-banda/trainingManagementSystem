from django.contrib import admin
from .models import Teacher, Subject, Attendance, TeacherScore

class TeacherAdmin(admin.ModelAdmin):
    list_display = ['name', 'active']


class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name']


class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'subject', 'date', 'is_present']


class TeacherScoreAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'subject', 'score']


admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(TeacherScore, TeacherScoreAdmin)


