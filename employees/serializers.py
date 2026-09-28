from rest_framework import serializers

from .models import (
    Employee, Department, Project, Asset,
    AssetAssignment, ProjectAssignment, Attendance,
    LeaveRequest, Notification
)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = [
            "id",
            "name",
            "description",
            "created_at",
        ]


class EmployeeSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(
        source="department",
        read_only=True,
    )

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_id",
            "name",
            "email",
            "phone",
            "salary",
            "department",
            "department_details",
            "created_at",
        ]
        
class ProjectSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "start_date",
            "end_date",
            "is_active"
        ]
    
    
class AssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Asset
        fields = [
            "id",
            "asset_id",
            "name",
            "asset_type",
            "purchase_date",
            "is_active"
        ]
        
class AssetAssignmentSerializer(serializers.ModelSerializer):
    asset_details = AssetSerializer(
        source="asset",
        read_only=True,
    )

    employee_details = EmployeeSerializer(
        source="employee",
        read_only=True,
    )

    class Meta:
        model = AssetAssignment
        fields = [
            "id",
            "asset",
            "asset_details",
            "employee",
            "employee_details",
            "assigned_at",
            "returned_at",
        ]

    def validate(self, attrs):
        asset = attrs.get("asset")
        returned_at = attrs.get("returned_at")

        if asset and not asset.is_active:
            raise serializers.ValidationError({
                "asset": "Inactive assets cannot be assigned."
            })

        if asset and returned_at is None:
            existing_assignment = AssetAssignment.objects.filter(
                asset=asset,
                returned_at__isnull=True,
            ).exists()

            if self.instance:
                existing_assignment = (
                    AssetAssignment.objects.filter(
                        asset=asset,
                        returned_at__isnull=True,
                    )
                    .exclude(id=self.instance.id)
                    .exists()
                )

            if existing_assignment:
                raise serializers.ValidationError({
                    "asset": "This asset is already assigned."
                })

        return attrs
    
    
class ProjectAssignmentSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(
        source="employee",
        read_only=True,
    )

    project_details = ProjectSerializer(
        source="project",
        read_only=True,
    )

    class Meta:
        model = ProjectAssignment
        fields = [
            "id",
            "employee",
            "employee_details",
            "project",
            "project_details",
            "assigned_at",
            "role",
        ]
        
class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.name",
        read_only=True,
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "employee",
            "employee_name",
            "date",
            "check_in",
            "check_out",
            "status",
        ]
        
class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.name",
        read_only=True,
    )

    class Meta:
        model = LeaveRequest
        fields = [
            "id",
            "employee",
            "employee_name",
            "start_date",
            "end_date",
            "reason",
            "status",
            "created_at",
            "reviewed_at",
        ]

        read_only_fields = [
            "employee",
            "status",
            "created_at",
            "reviewed_at",
        ]
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "message",
            "is_read",
            "created_at",
        ]