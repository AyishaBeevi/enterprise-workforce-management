import { useEffect, useState } from "react";

import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";

import ErrorMessage from "../components/common/ErrorMessage";
import { employeeService } from "../services/employeeService";
import { projectService } from "../services/projectService";
import {
  projectAssignmentService,
} from "../services/assignmentService";

import { useAuth } from "../context/AuthContext";

function ProjectAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [employee, setEmployee] = useState("");
  const [project, setProject] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { hasPermission } = useAuth();

  const canView = hasPermission(
    "employees.view_projectassignment"
  );

  const canAdd = hasPermission(
    "employees.add_projectassignment"
  );

  const canDelete = hasPermission(
    "employees.delete_projectassignment"
  );

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
        const [
        assignmentsResponse,
        employeesResponse,
        projectsResponse,
        ] = await Promise.all([
        projectAssignmentService.getAssignments(),
        employeeService.getEmployees(),
        projectService.getProjects(),
        ]);

        if (
        !assignmentsResponse.ok ||
        !employeesResponse.ok ||
        !projectsResponse.ok
        ) {
        throw new Error(
            "Failed to load assignment data."
        );
        }

        const assignmentsData =
        await assignmentsResponse.json();

        const employeesData =
        await employeesResponse.json();

        const projectsData =
        await projectsResponse.json();

        setAssignments(
        assignmentsData.results || assignmentsData
        );

        setEmployees(
        employeesData.results || employeesData
        );

        setProjects(
        projectsData.results || projectsData
        );
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    if (canView || canAdd) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [canView, canAdd]);

  const handleAssign = async (event) => {
    event.preventDefault();
    setError("");

    if (!employee || !project || !role) {
        setError(
        "Employee, project and role are required."
        );
        return;
    }

    try {
        const response =
        await projectAssignmentService.createAssignment({
            employee: Number(employee),
            project: Number(project),
            role,
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.non_field_errors?.[0] ||
            data.detail ||
            "Failed to assign employee."
        );
        }

        setEmployee("");
        setProject("");
        setRole("");

        loadData();
    } catch (error) {
        setError(error.message);
    }
    };

  const handleDelete = async (id) => {
    if (
        !window.confirm(
        "Remove this project assignment?"
        )
    ) {
        return;
    }

    try {
        const response =
        await projectAssignmentService.deleteAssignment(id);

        if (!response.ok) {
        throw new Error(
            "Failed to remove assignment."
        );
        }

        setAssignments((current) =>
        current.filter(
            (assignment) => assignment.id !== id
        )
        );
    } catch (error) {
        setError(error.message);
    }
    };

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (assignment) =>
        assignment.employee_details?.name ||
        assignment.employee ||
        "-",
    },

    {
      key: "project",
      label: "Project",
      render: (assignment) =>
        assignment.project_details?.name ||
        assignment.project ||
        "-",
    },

    {
      key: "role",
      label: "Role",
    },

    {
      key: "assigned_at",
      label: "Assigned At",
    },
  ];

  if (canDelete) {
    columns.push({
      key: "actions",
      label: "Actions",

      render: (assignment) => (
        <Button
          variant="danger"
          onClick={() =>
            handleDelete(assignment.id)
          }
        >
          Remove
        </Button>
      ),
    });
  }

  return (
    <div>
      <div className="page-header">
        <h1>Project Assignments</h1>

        <p>
          Assign employees to projects and manage
          their roles.
        </p>
      </div>

      <ErrorMessage message={error} />

      {canAdd && (
        <section className="form-card">
          <div className="page-section-header">
            <h2>Assign Employee</h2>

            <p>
              Add an employee to a project.
            </p>
          </div>

          <form
            onSubmit={handleAssign}
            className="assignment-form"
          >
            <div className="form-grid">
              <div className="form-field">
                <label>Employee</label>

                <select
                  value={employee}
                  onChange={(e) =>
                    setEmployee(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select Employee
                  </option>

                  {employees.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Project</label>

                <select
                  value={project}
                  onChange={(e) =>
                    setProject(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select Project
                  </option>

                  {projects.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Role</label>

                <input
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  placeholder="e.g. Backend Engineer"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit">
                Assign Employee
              </Button>
            </div>
          </form>
        </section>
      )}

      {canView && (
        <>
          {loading ? (
            <Loading message="Loading assignments..." />
          ) : (
            <section>
              <div className="page-section-header">
                <h2>Current Assignments</h2>
              </div>

              <DataTable
                columns={columns}
                data={assignments}
                emptyMessage="No project assignments found."
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default ProjectAssignmentsPage;