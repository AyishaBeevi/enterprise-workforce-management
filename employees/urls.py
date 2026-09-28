from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import (
    
    employee_list,
    employee_detail,
    employee_create,
    employee_update,
    employee_delete,
    employee_profile,
    
    department_list,
    department_detail,
    
    project_list,
    project_detail,
    project_assign_employee,
    project_remove_employee,
    
    asset_list,
    asset_detail,
    asset_assign,
    asset_return,
    
    attendance_check_in,
    attendance_check_out,
    attendance_list,
    leave_list,
    leave_request_create,
    leave_approval_list,
    leave_review,
    
    document_upload,
    document_list,
    document_delete,
    
    notification_list,
    notification_mark_read,
    
    report_dashboard,
    
    attendance_mark,
    attendance_management,
    attendance_update,
    
    employee_api_list,
    employee_api_detail,
    
    EmployeeListAPIView,
    EmployeeDetailAPIView,
    EmployeeListCreateAPIView,
    EmployeeRetrieveUpdateDestroyAPIView,
    EmployeeViewSet,
    
    DepartmentViewSet,
    ProjectViewSet,
    AssetViewSet,
    AssetAssignmentViewSet,
    ProjectAssignmentViewSet,
    
    AttendanceAPIView,
    AttendanceCheckInAPIView,
    AttendanceCheckOutAPIView,
    
    LeaveListAPIView,
    LeaveRequestCreateAPIView,
    LeaveApprovalListAPIView,
    LeaveReviewAPIView,
    
    NotificationListAPIView,
    NotificationMarkReadAPIView,
    
    DashboardAPIView,
    
    CurrentUserView
    
)


router = DefaultRouter()

router.register(
    "api/v4/employees",
    EmployeeViewSet,
)

router.register(
    "api/v4/departments",
    DepartmentViewSet,
)

router.register(
    "api/v4/projects",
    ProjectViewSet,
)

router.register(
    "api/v4/assets",
    AssetViewSet,
)

router.register(
    "api/v4/asset-assignments",
    AssetAssignmentViewSet,
)

router.register(
    "api/v4/project-assignments",
    ProjectAssignmentViewSet,
)

urlpatterns = [
    path("", employee_list, name="employee-list"),
    path(
        "<int:employee_id>/",
        employee_detail,
        name="employee-detail",
    ),
    path(
        "create/",
        employee_create,
        name="employee-create",
    ),
    path(
        "<int:employee_id>/edit/",
        employee_update,
        name="employee-update",
    ),
    path(
        "<int:employee_id>/delete/",
        employee_delete,
        name="employee-delete",
    ),
    path(
        "departments/",
        department_list,
        name="department-list",
    ),
    path(
        "departments/<int:department_id>/",
        department_detail,
        name="department-detail",
    ),
    path(
        "profile/",
        employee_profile,
        name="employee-profile",
    ),
    
    path(
        "projects/",
        project_list,
        name="project-list",
    ),

    path(
        "projects/<int:project_id>/",
        project_detail,
        name="project-detail",
    ),
    
    path(
        "projects/<int:project_id>/assign/",
        project_assign_employee,
        name="project-assign-employee",
    ),

    path(
        "project-assignments/<int:assignment_id>/delete/",
        project_remove_employee,
        name="project-remove-employee",
    ),

    path(
        "assets/",
        asset_list,
        name="asset-list",
    ),

    path(
        "assets/<int:asset_id>/",
        asset_detail,
        name="asset-detail",
    ),
    
        path(
        "assets/<int:asset_id>/assign/",
        asset_assign,
        name="asset-assign",
    ),

    path(
        "asset-assignments/<int:assignment_id>/return/",
        asset_return,
        name="asset-return",
    ),
    
    path(
        "attendance/check-in/",
        attendance_check_in,
        name="attendance-check-in",
    ),

    path(
        "attendance/check-out/",
        attendance_check_out,
        name="attendance-check-out",
    ),
    
    path(
        "attendance/",
        attendance_list,
        name="attendance-list",
    ),
    
    path(
        "leave/",
        leave_list,
        name="leave-list",
    ),

    path(
        "leave/request/",
        leave_request_create,
        name="leave-request-create",
    ),
    
    path(
        "leave/approvals/",
        leave_approval_list,
        name="leave-approval-list",
    ),

    path(
        "leave/<int:leave_id>/<str:action>/",
        leave_review,
        name="leave-review",
    ),
    
    path(
        "documents/upload/",
        document_upload,
        name="document-upload",
    ),
    
    path(
        "documents/",
        document_list,
        name="document-list",
    ),
    path(
            "documents/<int:document_id>/delete/",
            document_delete,
            name="document-delete",
    ),
    
    path(
        "notifications/",
        notification_list,
        name="notification-list",
    ),
    path(
        "notifications/<int:notification_id>/read/",
        notification_mark_read,
        name="notification-mark-read",
    ),
    
    path(
        "reports/",
        report_dashboard,
        name="report-dashboard",
    ),

    path(
        "attendance/mark/",
        attendance_mark,
        name="attendance-mark",
    ),
    
    path(
        "attendance/management/",
        attendance_management,
        name="attendance-management",
    ),
    path(
        "attendance/<int:attendance_id>/edit/",
        attendance_update,
        name="attendance-update",
    ),
    
    path(
        "api/employees/",
        employee_api_list,
        name="employee-api-list",
    ),
    
    path(
        "api/employees/<int:employee_id>/",
        employee_api_detail,
        name="employee-api-detail",
    ),
    
    
    
    path(
        "api/v2/employees/",
        EmployeeListAPIView.as_view(),
        name="employee-api-v2-list",
    ),

    path(
        "api/v2/employees/<int:employee_id>/",
        EmployeeDetailAPIView.as_view(),
        name="employee-api-v2-detail",
        
    ),
        
        path(
        "api/v3/employees/",
        EmployeeListCreateAPIView.as_view(),
        name="employee-api-v3-list",
    ),

    path(
        "api/v3/employees/<int:id>/",
        EmployeeRetrieveUpdateDestroyAPIView.as_view(),
        name="employee-api-v3-detail",
    ),
    
    path(
        "api/v4/attendance/",
        AttendanceAPIView.as_view(),
        name="attendance-api",
    ),

    path(
        "api/v4/attendance/check-in/",
        AttendanceCheckInAPIView.as_view(),
        name="attendance-api-check-in",
    ),

    path(
        "api/v4/attendance/check-out/",
        AttendanceCheckOutAPIView.as_view(),
        name="attendance-api-check-out",
    ),
    
    path(
        "api/v4/leave/",
        LeaveListAPIView.as_view(),
        name="leave-api",
    ),

    path(
        "api/v4/leave/request/",
        LeaveRequestCreateAPIView.as_view(),
        name="leave-api-request",
    ),

    path(
        "api/v4/leave/approvals/",
        LeaveApprovalListAPIView.as_view(),
        name="leave-api-approvals",
    ),

    path(
        "api/v4/leave/<int:leave_id>/<str:action>/",
        LeaveReviewAPIView.as_view(),
        name="leave-api-review",
    ),
    
    path(
        "api/v4/notifications/",
        NotificationListAPIView.as_view(),
        name="notification-api",
    ),

    path(
        "api/v4/notifications/<int:notification_id>/read/",
        NotificationMarkReadAPIView.as_view(),
        name="notification-api-read",
        ),
    
    path(
        "api/v4/dashboard/",
        DashboardAPIView.as_view(),
        name="dashboard-api",
    ),
    
        path(
        "api/v4/me/",
        CurrentUserView.as_view(),
        name="current-user",
    ),
    
    ]

urlpatterns += router.urls

