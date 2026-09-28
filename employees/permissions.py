from rest_framework.permissions import BasePermission


class EmployeePermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if view.action == "list":
            return request.user.has_perm(
                "employees.view_employee"
            )

        if view.action == "retrieve":
            return request.user.has_perm(
                "employees.view_employee"
            )

        if view.action == "create":
            return request.user.has_perm(
                "employees.add_employee"
            )

        if view.action in ["update", "partial_update"]:
            return request.user.has_perm(
                "employees.change_employee"
            )

        if view.action == "destroy":
            return request.user.has_perm(
                "employees.delete_employee"
            )

        return False
    
class DepartmentPermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if view.action in ["list", "retrieve"]:
            return request.user.has_perm(
                "employees.view_department"
            )

        if view.action == "create":
            return request.user.has_perm(
                "employees.add_department"
            )

        if view.action in ["update", "partial_update"]:
            return request.user.has_perm(
                "employees.change_department"
            )

        if view.action == "destroy":
            return request.user.has_perm(
                "employees.delete_department"
            )

        return False
    
class ProjectPermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if view.action in ["list", "retrieve"]:
            return request.user.has_perm(
                "employees.view_project"
            )

        if view.action == "create":
            return request.user.has_perm(
                "employees.add_project"
            )

        if view.action in ["update", "partial_update"]:
            return request.user.has_perm(
                "employees.change_project"
            )

        if view.action == "destroy":
            return request.user.has_perm(
                "employees.delete_project"
            )

        return False
    
class AssetPermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if view.action in ["list", "retrieve"]:
            return request.user.has_perm(
                "employees.view_asset"
            )

        if view.action == "create":
            return request.user.has_perm(
                "employees.add_asset"
            )

        if view.action in ["update", "partial_update"]:
            return request.user.has_perm(
                "employees.change_asset"
            )

        if view.action == "destroy":
            return request.user.has_perm(
                "employees.delete_asset"
            )

        return False
    

class AssetAssignmentPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if view.action in ["list", "retrieve"]:
            return request.user.has_perm(
                "employees.view_assetassignment"
            )

        if view.action == "create":
            return request.user.has_perm(
                "employees.add_assetassignment"
            )

        if view.action in ["update", "partial_update", "return_asset"]:
            return request.user.has_perm(
                "employees.change_assetassignment"
            )

        if view.action == "destroy":
            return request.user.has_perm(
                "employees.delete_assetassignment"
            )

        return False