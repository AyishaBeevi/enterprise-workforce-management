from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission


class Command(BaseCommand):
    help = "Set up EAWMS user groups and permissions"

    def handle(self, *args, **options):

        employee_group, _ = Group.objects.get_or_create(
            name="Employee"
        )

        manager_group, _ = Group.objects.get_or_create(
            name="Manager"
        )

        employee_permissions = Permission.objects.filter(
            content_type__app_label="employees",
            codename__in=[
                "view_employee",
                "view_department",
                "view_project",
                "view_asset",
                "view_attendance",
                "add_attendance",
                "view_leaverequest",
                "add_leaverequest",
            ],
        )

        manager_permissions = Permission.objects.filter(
            content_type__app_label="employees",
            codename__in=[
                "view_employee",
                "add_employee",
                "change_employee",
                "view_department",
                "add_department",
                "change_department",
                "view_project",
                "add_project",
                "change_project",
                "view_asset",
                "add_asset",
                "change_asset",
                "view_attendance",
                "add_attendance",
                "change_attendance",
                "view_leaverequest",
                "change_leaverequest",
                "add_projectassignment",
                "delete_projectassignment",
                "add_assetassignment",
                "change_assetassignment",
            ],
        )

        employee_group.permissions.set(
            employee_permissions
        )

        manager_group.permissions.set(
            manager_permissions
        )

        self.stdout.write(
            self.style.SUCCESS(
                "EAWMS permissions configured successfully."
            )
        )