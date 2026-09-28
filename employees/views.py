from urllib.parse import urlencode
from datetime import date

from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required, permission_required
from django.db.models import Count
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.db.models import Count
from datetime import timedelta

from django.core.mail import send_mail

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import (
    EmployeeSerializer, DepartmentSerializer, ProjectSerializer, 
    AssetSerializer, AssetAssignmentSerializer, ProjectAssignmentSerializer, 
    AttendanceSerializer, LeaveRequestSerializer, NotificationSerializer
)

from django.db.models import ProtectedError
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import EmployeePermission, DepartmentPermission, ProjectPermission, AssetPermission, AssetAssignmentPermission

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)

from rest_framework.decorators import action


from rest_framework import status

from .forms import EmployeeForm, ProjectAssignmentForm, LeaveRequestForm, DocumentForm, AttendanceForm

from .models import (
    Department,
    Employee,
    Project,
    ProjectAssignment,
    Asset,
    AssetAssignment,
    Attendance,
    LeaveRequest,
    Document,
    Notification
)



# ============================================================
# EMPLOYEES
# ============================================================

@permission_required(
    "employees.view_employee",
    raise_exception=True,
)
def employee_list(request):
    search = request.GET.get("search", "")
    department_name = request.GET.get("department", "")
    sort = request.GET.get("sort", "name")

    allowed_sorts = {
        "name": "name",
        "-name": "-name",
        "salary": "salary",
        "-salary": "-salary",
    }

    if sort not in allowed_sorts:
        sort = "name"

    employees = Employee.objects.select_related("department")
    departments = Department.objects.all()

    if search:
        employees = employees.filter(
            name__icontains=search
        )

    if department_name:
        employees = employees.filter(
            department__name=department_name
        )

    employees = employees.order_by(
        allowed_sorts[sort]
    )

    paginator = Paginator(employees, 2)

    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    query_params = request.GET.copy()
    query_params.pop("page", None)
    query_params = urlencode(query_params)

    return render(
        request,
        "employees/employee_list.html",
        {
            "employees": page_obj,
            "departments": departments,
            "search": search,
            "department_name": department_name,
            "sort": sort,
            "query_params": query_params,
        },
    )


@permission_required(
    "employees.view_employee",
    raise_exception=True,
)
def employee_detail(request, employee_id):
    employee = get_object_or_404(
        Employee,
        id=employee_id,
    )

    return render(
        request,
        "employees/employee_detail.html",
        {"employee": employee},
    )


@permission_required(
    "employees.add_employee",
    raise_exception=True,
)
def employee_create(request):
    if request.method == "POST":
        form = EmployeeForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("employee-list")

    else:
        form = EmployeeForm()

    return render(
        request,
        "employees/employee_form.html",
        {"form": form},
    )


@permission_required(
    "employees.change_employee",
    raise_exception=True,
)
def employee_update(request, employee_id):
    employee = get_object_or_404(
        Employee,
        id=employee_id,
    )

    if request.method == "POST":
        form = EmployeeForm(
            request.POST,
            instance=employee,
        )

        if form.is_valid():
            form.save()

            return redirect(
                "employee-detail",
                employee_id=employee.id,
            )

    else:
        form = EmployeeForm(
            instance=employee
        )

    return render(
        request,
        "employees/employee_form.html",
        {
            "form": form,
            "employee": employee,
        },
    )


@permission_required(
    "employees.delete_employee",
    raise_exception=True,
)
def employee_delete(request, employee_id):
    employee = get_object_or_404(
        Employee,
        id=employee_id,
    )

    if request.method == "POST":
        employee.delete()
        return redirect("employee-list")

    return render(
        request,
        "employees/employee_confirm_delete.html",
        {"employee": employee},
    )


# ============================================================
# DEPARTMENTS
# ============================================================

@permission_required(
    "employees.view_department",
    raise_exception=True,
)
def department_list(request):
    departments = Department.objects.annotate(
        employee_count=Count("employees")
    )

    return render(
        request,
        "employees/department_list.html",
        {"departments": departments},
    )


@permission_required(
    "employees.view_department",
    raise_exception=True,
)
def department_detail(request, department_id):
    department = get_object_or_404(
        Department,
        id=department_id,
    )

    employees = department.employees.select_related(
        "department"
    )

    return render(
        request,
        "employees/department_detail.html",
        {
            "department": department,
            "employees": employees,
        },
    )


# ============================================================
# EMPLOYEE PROFILE
# ============================================================

@login_required
def employee_profile(request):
    employee = request.user.employee

    return render(
        request,
        "employees/employee_profile.html",
        {"employee": employee},
    )


# ============================================================
# PROJECTS
# ============================================================

@permission_required(
    "employees.view_project",
    raise_exception=True,
)
def project_list(request):
    projects = Project.objects.all().order_by("name")

    return render(
        request,
        "employees/project_list.html",
        {"projects": projects},
    )


@permission_required(
    "employees.view_project",
    raise_exception=True,
)
def project_detail(request, project_id):
    project = get_object_or_404(
        Project,
        id=project_id,
    )

    assignments = project.employee_assignments.select_related(
        "employee"
    )

    return render(
        request,
        "employees/project_detail.html",
        {
            "project": project,
            "assignments": assignments,
        },
    )


@permission_required(
    "employees.add_projectassignment",
    raise_exception=True,
)
def project_assign_employee(request, project_id):
    project = get_object_or_404(
        Project,
        id=project_id,
    )

    if request.method == "POST":
        form = ProjectAssignmentForm(
            request.POST,
            project=project,
        )

        if form.is_valid():
            assignment = form.save(commit=False)
            assignment.project = project
            assignment.save()

            return redirect(
                "project-detail",
                project_id=project.id,
            )

    else:
        form = ProjectAssignmentForm(
            project=project,
        )

    return render(
        request,
        "employees/project_assignment_form.html",
        {
            "form": form,
            "project": project,
        },
    )


@permission_required(
    "employees.delete_projectassignment",
    raise_exception=True,
)
def project_remove_employee(request, assignment_id):
    assignment = get_object_or_404(
        ProjectAssignment,
        id=assignment_id,
    )

    if request.method == "POST":
        project_id = assignment.project.id
        assignment.delete()

        return redirect(
            "project-detail",
            project_id=project_id,
        )

    return render(
        request,
        "employees/project_assignment_confirm_delete.html",
        {"assignment": assignment},
    )


# ============================================================
# ASSETS
# ============================================================

@permission_required(
    "employees.view_asset",
    raise_exception=True,
)
def asset_list(request):
    assets = Asset.objects.all().order_by("asset_id")

    for asset in assets:
        asset.current_assignment = (
            asset.assignments
            .select_related("employee")
            .filter(returned_at__isnull=True)
            .first()
        )

    return render(
        request,
        "employees/asset_list.html",
        {"assets": assets},
    )


@permission_required(
    "employees.view_asset",
    raise_exception=True,
)
def asset_detail(request, asset_id):
    asset = get_object_or_404(
        Asset,
        id=asset_id,
    )

    assignments = asset.assignments.select_related(
        "employee"
    )

    current_assignment = assignments.filter(
        returned_at__isnull=True
    ).first()

    return render(
        request,
        "employees/asset_detail.html",
        {
            "asset": asset,
            "assignments": assignments,
            "current_assignment": current_assignment,
        },
    )


@permission_required(
    "employees.add_assetassignment",
    raise_exception=True,
)
def asset_assign(request, asset_id):
    asset = get_object_or_404(
        Asset,
        id=asset_id,
    )

    if request.method == "POST":
        employee_id = request.POST.get("employee")

        employee = get_object_or_404(
            Employee,
            id=employee_id,
        )

        if AssetAssignment.objects.filter(
            asset=asset,
            returned_at__isnull=True,
        ).exists():
            return redirect(
                "asset-detail",
                asset_id=asset.id,
            )

        AssetAssignment.objects.create(
            asset=asset,
            employee=employee,
        )

        return redirect(
            "asset-detail",
            asset_id=asset.id,
        )

    employees = Employee.objects.order_by("name")

    return render(
        request,
        "employees/asset_assign.html",
        {
            "asset": asset,
            "employees": employees,
        },
    )


@permission_required(
    "employees.change_assetassignment",
    raise_exception=True,
)
def asset_return(request, assignment_id):
    assignment = get_object_or_404(
        AssetAssignment,
        id=assignment_id,
    )

    if request.method == "POST":
        assignment.returned_at = date.today()
        assignment.save()

    return redirect(
        "asset-detail",
        asset_id=assignment.asset.id,
    )


# ============================================================
# ATTENDANCE
# ============================================================

@permission_required(
    "employees.add_attendance",
    raise_exception=True,
)
def attendance_check_in(request):
    if request.method == "POST":
        employee = request.user.employee
        today = timezone.localdate()

        attendance, created = Attendance.objects.get_or_create(
            employee=employee,
            date=today,
            defaults={
                "check_in": timezone.localtime().time(),
                "status": "PRESENT",
            },
        )

        return redirect("attendance-list")

    return redirect("attendance-list")


@permission_required(
    "employees.change_attendance",
    raise_exception=True,
)
def attendance_check_out(request):
    if request.method == "POST":
        employee = request.user.employee
        today = timezone.localdate()

        attendance = get_object_or_404(
            Attendance,
            employee=employee,
            date=today,
        )

        if attendance.check_in and not attendance.check_out:
            attendance.check_out = timezone.localtime().time()

            attendance.save(
                update_fields=["check_out"]
            )

        return redirect("attendance-list")

    return redirect("attendance-list")


@permission_required(
    "employees.view_attendance",
    raise_exception=True,
)
def attendance_list(request):
    employee = request.user.employee

    records = Attendance.objects.filter(
        employee=employee
    ).order_by("-date")

    today = timezone.localdate()

    today_record = records.filter(
        date=today
    ).first()

    return render(
        request,
        "employees/attendance_list.html",
        {
            "records": records,
            "today_record": today_record,
        },
    )
    
    
@permission_required(
    "employees.change_attendance",
    raise_exception=True,
)
def attendance_management(request):

    records = Attendance.objects.select_related(
        "employee"
    ).order_by("-date", "employee__name")

    return render(
        request,
        "employees/attendance_management.html",
        {
            "records": records,
        },
    )

@permission_required(
    "employees.change_attendance",
    raise_exception=True,
)
def attendance_update(request, attendance_id):

    attendance = get_object_or_404(
        Attendance,
        id=attendance_id,
    )

    if request.method == "POST":
        form = AttendanceForm(
            request.POST,
            instance=attendance,
        )

        if form.is_valid():
            form.save()

            return redirect("attendance-management")

    else:
        form = AttendanceForm(
            instance=attendance,
        )

    return render(
        request,
        "employees/attendance_form.html",
        {
            "form": form,
            "attendance": attendance,
        },
    )

# ============================================================
# LEAVE REQUESTS
# ============================================================

@permission_required(
    "employees.add_leaverequest",
    raise_exception=True,
)
def leave_request_create(request):
    if request.method == "POST":
        form = LeaveRequestForm(request.POST)

        if form.is_valid():
            leave_request = form.save(
                commit=False
            )

            leave_request.employee = (
                request.user.employee
            )

            leave_request.save()

            return redirect("leave-list")

    else:
        form = LeaveRequestForm()

    return render(
        request,
        "employees/leave_request_form.html",
        {"form": form},
    )


@permission_required(
    "employees.view_leaverequest",
    raise_exception=True,
)
def leave_list(request):
    requests = LeaveRequest.objects.filter(
        employee=request.user.employee
    ).order_by("-created_at")

    return render(
        request,
        "employees/leave_list.html",
        {"requests": requests},
    )


@permission_required(
    "employees.change_leaverequest",
    raise_exception=True,
)
def leave_approval_list(request):
    requests = LeaveRequest.objects.select_related(
        "employee",
        "employee__department",
    ).order_by("-created_at")

    return render(
        request,
        "employees/leave_approval_list.html",
        {"requests": requests},
    )


@permission_required(
    "employees.change_leaverequest",
    raise_exception=True,
)
def leave_review(request, leave_id, action):
    leave_request = get_object_or_404(
        LeaveRequest,
        id=leave_id,
    )

    if request.method == "POST":

        if action == "approve":
            leave_request.status = "APPROVED"

        elif action == "reject":
            leave_request.status = "REJECTED"

        else:
            return redirect(
                "leave-approval-list"
            )

        leave_request.reviewed_at = timezone.now()

        leave_request.save(
            update_fields=[
                "status",
                "reviewed_at",
            ]
        )
        
        if leave_request.status == "APPROVED":
            current_date = leave_request.start_date

            while current_date <= leave_request.end_date:

                Attendance.objects.get_or_create(
                    employee=leave_request.employee,
                    date=current_date,
                    defaults={
                        "status": "LEAVE",
                    },
                )

                current_date += timedelta(days=1)
        
        Notification.objects.create(
            employee=leave_request.employee,
            message=(
                f"Your leave request from "
                f"{leave_request.start_date} to "
                f"{leave_request.end_date} "
                f"was {leave_request.status.lower()}."
            ),
        )
        
        send_mail(
            subject="Leave Request Update",
            message=(
                f"Your leave request from "
                f"{leave_request.start_date} to "
                f"{leave_request.end_date} "
                f"was {leave_request.status.lower()}."
            ),
            from_email=None,
            recipient_list=[
                leave_request.employee.user.email,
            ],
        )

    return redirect(
        "leave-approval-list"
    )
    
@login_required
def document_upload(request):
    employee = request.user.employee

    if request.method == "POST":
        form = DocumentForm(
            request.POST,
            request.FILES,
        )

        if form.is_valid():
            document = form.save(commit=False)
            document.employee = employee
            document.save()

            return redirect("document-list")

    else:
        form = DocumentForm()

    return render(
        request,
        "employees/document_form.html",
        {"form": form},
    )
    
    
@login_required
def document_list(request):
    documents = Document.objects.filter(
        employee=request.user.employee
    ).order_by("-uploaded_at")

    return render(
        request,
        "employees/document_list.html",
        {"documents": documents},
    )
    
@login_required
def document_delete(request, document_id):
    document = get_object_or_404(
        Document,
        id=document_id,
        employee=request.user.employee,
    )

    if request.method == "POST":
        document.file.delete(save=False)
        document.delete()

        return redirect("document-list")

    return render(
        request,
        "employees/document_confirm_delete.html",
        {"document": document},
    )
    
@login_required
def notification_list(request):
    notifications = Notification.objects.filter(
        employee=request.user.employee
    ).order_by("-created_at")

    return render(
        request,
        "employees/notification_list.html",
        {"notifications": notifications},
    )
    
@login_required
def notification_mark_read(request, notification_id):
    notification = get_object_or_404(
        Notification,
        id=notification_id,
        employee=request.user.employee,
    )

    if request.method == "POST":
        notification.is_read = True
        notification.save(update_fields=["is_read"])

    return redirect("notification-list")

@login_required
@permission_required(
    "employees.view_employee",
    raise_exception=True,
)
def report_dashboard(request):

    total_employees = Employee.objects.count()
    total_departments = Department.objects.count()
    total_projects = Project.objects.count()
    total_assets = Asset.objects.count()
    department_stats = Department.objects.annotate(
        employee_count=Count("employees")
    )
    assigned_assets = AssetAssignment.objects.filter(
        returned_at__isnull=True
    ).count()

    available_assets = Asset.objects.count() - assigned_assets

    pending_leaves = LeaveRequest.objects.filter(
        status="PENDING"
    ).count()

    approved_leaves = LeaveRequest.objects.filter(
        status="APPROVED"
    ).count()

    rejected_leaves = LeaveRequest.objects.filter(
        status="REJECTED"
    ).count()
    
    present_count = Attendance.objects.filter(
        status="PRESENT"
    ).count()

    absent_count = Attendance.objects.filter(
        status="ABSENT"
    ).count()

    leave_count = Attendance.objects.filter(
        status="LEAVE"
    ).count()

    return render(
        request,
        "employees/report_dashboard.html",
        {
            "total_employees": total_employees,
            "total_departments": total_departments,
            "total_projects": total_projects,
            "total_assets": total_assets,
            "pending_leaves": pending_leaves,
            "approved_leaves": approved_leaves,
            "rejected_leaves": rejected_leaves,
            "department_stats": department_stats,
            "assigned_assets": assigned_assets,
            "available_assets": available_assets,
            "present_count": present_count,
            "absent_count": absent_count,
            "leave_count": leave_count,
        },
    )
    
@permission_required(
    "employees.change_attendance",
    raise_exception=True,
)
def attendance_mark(request):

    if request.method == "POST":

        form = AttendanceForm(request.POST)

        if form.is_valid():

            attendance = form.save()

            return redirect("attendance-list")

    else:
        form = AttendanceForm()

    return render(
        request,
        "employees/attendance_mark.html",
        {"form": form},
    )

@api_view(["GET", "POST"])
def employee_api_list(request):

    if request.method == "GET":

        employees = Employee.objects.all()

        serializer = EmployeeSerializer(
            employees,
            many=True,
        )

        return Response(serializer.data)

    if request.method == "POST":

        serializer = EmployeeSerializer(
            data=request.data
        )

        if serializer.is_valid():

            employee = serializer.save()

            return Response(
                EmployeeSerializer(employee).data,
                status=201,
            )

        return Response(
            serializer.errors,
            status=400,
        )

@api_view(["GET", "PUT", "PATCH", "DELETE"])
def employee_api_detail(request, employee_id):

    employee = get_object_or_404(
        Employee,
        id=employee_id,
    )

    if request.method == "GET":

        serializer = EmployeeSerializer(employee)

        return Response(serializer.data)

    if request.method in ["PUT", "PATCH"]:

        serializer = EmployeeSerializer(
            employee,
            data=request.data,
            partial=(request.method == "PATCH"),
        )

        if serializer.is_valid():

            employee = serializer.save()

            return Response(
                EmployeeSerializer(employee).data
            )

        return Response(
            serializer.errors,
            status=400,
        )

    if request.method == "DELETE":

        try:
            employee.delete()

        except ProtectedError:
            return Response(
                {
                    "error": "Employee cannot be deleted because they have related records."
                },
                status=409,
            )

        return Response(
            status=204
        )
        
class EmployeeListAPIView(APIView):

    def get(self, request):

        employees = Employee.objects.all()

        serializer = EmployeeSerializer(
            employees,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = EmployeeSerializer(
            data=request.data
        )

        if serializer.is_valid():

            employee = serializer.save()

            return Response(
                EmployeeSerializer(employee).data,
                status=201,
            )

        return Response(
            serializer.errors,
            status=400,
        )
        
class EmployeeDetailAPIView(APIView):

    def get_object(self, employee_id):

        return get_object_or_404(
            Employee,
            id=employee_id,
        )

    def get(self, request, employee_id):

        employee = self.get_object(employee_id)

        serializer = EmployeeSerializer(employee)

        return Response(serializer.data)

    def patch(self, request, employee_id):

        employee = self.get_object(employee_id)

        serializer = EmployeeSerializer(
            employee,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():

            employee = serializer.save()

            return Response(
                EmployeeSerializer(employee).data
            )

        return Response(
            serializer.errors,
            status=400,
        )
        
class EmployeeListCreateAPIView(
    generics.ListCreateAPIView
):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    
class EmployeeRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = "id"
    
    
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related(
        "department"
    ).prefetch_related(
        "attendance_records"
    )
    serializer_class = EmployeeSerializer
    permission_classes = [EmployeePermission]
    
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "department",
    ]

    search_fields = [
        "name",
        "employee_id",
        "email",
    ]

    ordering_fields = [
        "name",
        "salary",
        "created_at",
    ]

    ordering = [
        "name",
    ]
    
class DepartmentViewSet(viewsets.ModelViewSet):

    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [DepartmentPermission]
    
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "name",
    ]

    ordering_fields = [
        "name",
        "id",
    ]

    ordering = [
        "name",
    ]
    
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [ProjectPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]


    search_fields = [
        "name",
    ]

    ordering_fields = [
        "name",
        "created_at",
    ]

    ordering = [
        "name",
    ]


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [AssetPermission]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = ["asset_type", "is_active"]
    search_fields = ["asset_id", "name", "asset_type"]
    ordering_fields = ["name", "asset_id", "purchase_date"]
    ordering = ["name"]
    
class AssetAssignmentViewSet(viewsets.ModelViewSet):
    queryset = AssetAssignment.objects.select_related(
        "asset",
        "employee",
    )
    serializer_class = AssetAssignmentSerializer
    permission_classes = [AssetAssignmentPermission]

    @action(
        detail=True,
        methods=["post"],
        url_path="return",
    )
    def return_asset(self, request, pk=None):
        assignment = self.get_object()

        if assignment.returned_at:
            return Response(
                {"detail": "This asset has already been returned."},
                status=400,
            )

        assignment.returned_at = timezone.localdate()
        assignment.save(update_fields=["returned_at"])

        serializer = self.get_serializer(assignment)

        return Response(serializer.data)
    
class ProjectAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ProjectAssignment.objects.select_related(
        "employee",
        "project",
    )

    serializer_class = ProjectAssignmentSerializer

    permission_classes = [IsAuthenticated]
    
    
class AttendanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user.employee

        today = timezone.localdate()

        today_record = Attendance.objects.filter(
            employee=employee,
            date=today,
        ).first()

        history = Attendance.objects.filter(
            employee=employee
        ).order_by("-date")

        return Response({
            "today": (
                AttendanceSerializer(today_record).data
                if today_record
                else None
            ),
            "history": AttendanceSerializer(
                history,
                many=True,
            ).data,
        })
        
        
class AttendanceCheckInAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        employee = request.user.employee
        today = timezone.localdate()
        current_time = timezone.localtime().time()

        attendance, created = Attendance.objects.get_or_create(
            employee=employee,
            date=today,
            defaults={
                "check_in": current_time,
                "status": "PRESENT",
            },
        )

        if not created and attendance.check_in:
            return Response(
                {
                    "detail": "You have already checked in today."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance.check_in = current_time
        attendance.status = "PRESENT"
        attendance.save(
            update_fields=["check_in", "status"]
        )

        return Response(
            AttendanceSerializer(attendance).data
        )
        
        
class AttendanceCheckOutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        employee = request.user.employee
        today = timezone.localdate()
        current_time = timezone.localtime().time()

        attendance = Attendance.objects.filter(
            employee=employee,
            date=today,
        ).first()

        if not attendance:
            return Response(
                {
                    "detail": "You have not checked in today."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not attendance.check_in:
            return Response(
                {
                    "detail": "You have not checked in today."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if attendance.check_out:
            return Response(
                {
                    "detail": "You have already checked out today."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        attendance.check_out = current_time

        attendance.save(
            update_fields=["check_out"]
        )

        return Response(
            AttendanceSerializer(attendance).data
        )
        
class LeaveListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user.employee

        leaves = LeaveRequest.objects.filter(
            employee=employee
        ).order_by("-created_at")

        return Response(
            LeaveRequestSerializer(
                leaves,
                many=True,
            ).data
        )

class LeaveRequestCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LeaveRequestSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(
                employee=request.user.employee
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
        
class LeaveApprovalListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.has_perm(
            "employees.change_leaverequest"
        ):
            return Response(
                {"detail": "You do not have permission."},
                status=status.HTTP_403_FORBIDDEN,
            )

        leaves = LeaveRequest.objects.filter(
            status="PENDING"
        ).select_related(
            "employee"
        ).order_by("-created_at")

        return Response(
            LeaveRequestSerializer(
                leaves,
                many=True,
            ).data
        )
        
class LeaveReviewAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, leave_id, action):
        if not request.user.has_perm(
            "employees.change_leaverequest"
        ):
            return Response(
                {"detail": "You do not have permission."},
                status=status.HTTP_403_FORBIDDEN,
            )

        leave_request = get_object_or_404(
            LeaveRequest,
            id=leave_id,
        )

        if leave_request.status != "PENDING":
            return Response(
                {
                    "detail": (
                        "This leave request has already "
                        "been reviewed."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if action == "approve":
            leave_request.status = "APPROVED"

        elif action == "reject":
            leave_request.status = "REJECTED"

        else:
            return Response(
                {"detail": "Invalid action."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        leave_request.reviewed_at = timezone.now()

        leave_request.save(
            update_fields=[
                "status",
                "reviewed_at",
            ]
        )

        # Create notification for the employee
        if action == "approve":
            message = (
                f"Your leave request from "
                f"{leave_request.start_date} to "
                f"{leave_request.end_date} "
                f"has been approved."
            )
        else:
            message = (
                f"Your leave request from "
                f"{leave_request.start_date} to "
                f"{leave_request.end_date} "
                f"has been rejected."
            )

        Notification.objects.create(
            employee=leave_request.employee,
            message=message,
        )

        # Create attendance records for approved leave
        if action == "approve":
            current_date = leave_request.start_date

            while current_date <= leave_request.end_date:
                Attendance.objects.get_or_create(
                    employee=leave_request.employee,
                    date=current_date,
                    defaults={
                        "status": "LEAVE"
                    },
                )

                current_date += timedelta(days=1)

        return Response(
            LeaveRequestSerializer(
                leave_request
            ).data
        )


class NotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user.employee

        notifications = Notification.objects.filter(
            employee=employee
        ).order_by("-created_at")

        unread_count = notifications.filter(
            is_read=False
        ).count()

        return Response({
            "unread_count": unread_count,
            "notifications": NotificationSerializer(
                notifications,
                many=True,
            ).data,
        })
        
class NotificationMarkReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        employee = request.user.employee

        notification = get_object_or_404(
            Notification,
            id=notification_id,
            employee=employee,
        )

        notification.is_read = True

        notification.save(
            update_fields=["is_read"]
        )

        return Response(
            NotificationSerializer(notification).data
        )
        
        
class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()

        employee_count = Employee.objects.count()
        department_count = Department.objects.count()
        project_count = Project.objects.count()
        asset_count = Asset.objects.count()

        today_attendance = Attendance.objects.filter(
            date=today
        )

        present_count = today_attendance.filter(
            status="PRESENT"
        ).count()

        leave_count = today_attendance.filter(
            status="LEAVE"
        ).count()

        pending_leave_count = LeaveRequest.objects.filter(
            status="PENDING"
        ).count()

        unread_notifications = 0

        if hasattr(request.user, "employee"):
            unread_notifications = Notification.objects.filter(
                employee=request.user.employee,
                is_read=False,
            ).count()

        return Response({
            "employees": employee_count,
            "departments": department_count,
            "projects": project_count,
            "assets": asset_count,
            "present_today": present_count,
            "leave_today": leave_count,
            "pending_leaves": pending_leave_count,
            "unread_notifications": unread_notifications,
        })
        
        
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "groups": list(
                user.groups.values_list("name", flat=True)
            ),
            "permissions": sorted(
                user.get_all_permissions()
            ),
        })