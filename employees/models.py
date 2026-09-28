from django.db import models
from django.contrib.auth.models import User


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Employee(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.PROTECT,
        related_name="employee",
        null=True,
        blank=True,
    )
    
    employee_id = models.CharField(
        max_length=20,
        unique=True
    )
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(
        max_length=20,
        blank=True
    )
    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        related_name="employees"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.name
    
class Project(models.Model):
    name = models.CharField(
        max_length=150,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    start_date = models.DateField()

    end_date = models.DateField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return self.name
    
class ProjectAssignment(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="project_assignments",
    )

    project = models.ForeignKey(
        Project,
        on_delete=models.PROTECT,
        related_name="employee_assignments",
    )

    assigned_at = models.DateField(
        auto_now_add=True,
    )

    role = models.CharField(
        max_length=100,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["employee", "project"],
                name="unique_employee_project",
            ),
        ]

    def __str__(self):
        return f"{self.employee.name} - {self.project.name}"

class Asset(models.Model):
    asset_id = models.CharField(
        max_length=30,
        unique=True,
    )

    name = models.CharField(
        max_length=100,
    )

    asset_type = models.CharField(
        max_length=50,
    )

    purchase_date = models.DateField(
        null=True,
        blank=True,
    )

    is_active = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return f"{self.asset_id} - {self.name}"
    
class AssetAssignment(models.Model):
    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name="assignments",
    )

    employee = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="asset_assignments",
    )

    assigned_at = models.DateField(
        auto_now_add=True,
    )

    returned_at = models.DateField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-assigned_at"]
        
        constraints = [
                models.UniqueConstraint(
                    fields=["asset"],
                    condition=models.Q(returned_at__isnull=True),
                    name="unique_active_asset_assignment",
                ),
            ]

    def __str__(self):
        return f"{self.asset.asset_id} - {self.employee.name}"
    
    
class Attendance(models.Model):
    STATUS_CHOICES = [
        ("PRESENT", "Present"),
        ("ABSENT", "Absent"),
        ("LEAVE", "Leave"),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="attendance_records",
    )

    date = models.DateField()

    check_in = models.TimeField(
        null=True,
        blank=True,
    )

    check_out = models.TimeField(
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="PRESENT",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["employee", "date"],
                name="unique_employee_attendance_day",
            ),
        ]
        ordering = ["-date"]

    def __str__(self):
        return f"{self.employee.name} - {self.date}"
    
class LeaveRequest(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.PROTECT,
        related_name="leave_requests",
    )

    start_date = models.DateField()
    end_date = models.DateField()

    reason = models.TextField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="PENDING",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    reviewed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.employee.name} - "
            f"{self.start_date} to {self.end_date}"
        )
        
class Document(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="documents",
    )

    title = models.CharField(
        max_length=200,
    )

    file = models.FileField(
        upload_to="employee_documents/",
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.employee.name} - {self.title}"
    
class Notification(models.Model):
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    message = models.CharField(
        max_length=255,
    )

    is_read = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.employee.name} - {self.message}"