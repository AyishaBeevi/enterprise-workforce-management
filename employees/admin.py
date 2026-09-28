from django.contrib import admin

from .models import Department, Employee, Asset, AssetAssignment, Project, ProjectAssignment
from .models import Attendance, LeaveRequest

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "description",
        "created_at",
    )
    search_fields = (
        "name",
        "description",
    )


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "employee_id",
        "name",
        "email",
        "department",
        "salary",
        "created_at",
    )

    search_fields = (
        "employee_id",
        "name",
        "email",
    )

    list_filter = (
        "department",
    )

    ordering = (
        "name",
    )

    list_per_page = 25
    
@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = (
        "asset_id",
        "name",
        "asset_type",
        "purchase_date",
        "is_active",
    )

    search_fields = (
        "asset_id",
        "name",
    )

    list_filter = (
        "asset_type",
        "is_active",
    )
    
@admin.register(AssetAssignment)
class AssetAssignmentAdmin(admin.ModelAdmin):
    list_display = (
        "asset",
        "employee",
        "assigned_at",
        "returned_at",
    )

    list_filter = (
        "assigned_at",
        "returned_at",
    )

    search_fields = (
        "asset__asset_id",
        "asset__name",
        "employee__name",
        "employee__employee_id",
    )
    
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        "employee",
        "date",
        "check_in",
        "check_out",
        "status",
    )

    list_filter = (
        "status",
        "date",
    )

    search_fields = (
        "employee__name",
        "employee__employee_id",
    )

    ordering = (
        "-date",
    )
    
@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = (
        "employee",
        "start_date",
        "end_date",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "start_date",
        "end_date",
    )

    search_fields = (
        "employee__name",
        "employee__employee_id",
        "reason",
    )