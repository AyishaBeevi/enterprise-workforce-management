from django import forms

from .models import Employee, Attendance, ProjectAssignment, LeaveRequest
from .models import Document


from django.core.exceptions import ValidationError
from django.utils import timezone


class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = [
            "employee_id",
            "name",
            "email",
            "phone",
            "salary",
            "department",
        ]
        
class ProjectAssignmentForm(forms.ModelForm):
    class Meta:
        model = ProjectAssignment
        fields = [
            "employee",
            "role",
        ]

    def __init__(self, *args, project=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.project = project

    def clean_employee(self):
        employee = self.cleaned_data["employee"]

        if ProjectAssignment.objects.filter(
            employee=employee,
            project=self.project,
        ).exists():
            raise forms.ValidationError(
                "This employee is already assigned to this project."
            )

        return employee
    
class LeaveRequestForm(forms.ModelForm):
    class Meta:
        model = LeaveRequest
        fields = [
            "start_date",
            "end_date",
            "reason",
        ]
        widgets = {
            "start_date": forms.DateInput(
                attrs={"type": "date"}
            ),
            "end_date": forms.DateInput(
                attrs={"type": "date"}
            ),
            "reason": forms.Textarea(
                attrs={"rows": 4}
            ),
        }

    def clean(self):
        cleaned_data = super().clean()

        start_date = cleaned_data.get("start_date")
        end_date = cleaned_data.get("end_date")

        if start_date and end_date:
            if end_date < start_date:
                raise forms.ValidationError(
                    "End date cannot be before start date."
                )

        return cleaned_data
    
class DocumentForm(forms.ModelForm):
    class Meta:
        model = Document
        fields = [
            "title",
            "file",
        ]

    def clean_file(self):
        file = self.cleaned_data["file"]

        allowed_extensions = [
            ".pdf",
            ".doc",
            ".docx",
            ".txt",
        ]

        extension = file.name.lower().rsplit(".", 1)[-1]

        if f".{extension}" not in allowed_extensions:
            raise forms.ValidationError(
                "Only PDF, DOC, DOCX, and TXT files are allowed."
            )

        max_size = 5 * 1024 * 1024

        if file.size > max_size:
            raise forms.ValidationError(
                "File size cannot exceed 5 MB."
            )

        return file
    
class AttendanceForm(forms.ModelForm):

    class Meta:
        model = Attendance
        fields = [
            "employee",
            "date",
            "status",
        ]

        widgets = {
            "date": forms.DateInput(
                attrs={
                    "type": "date",
                }
            ),
        }
        
    def clean_date(self):
        date = self.cleaned_data["date"]

        if date > timezone.localdate():
            raise ValidationError(
                    "Attendance cannot be marked for a future date."
            )

        return date