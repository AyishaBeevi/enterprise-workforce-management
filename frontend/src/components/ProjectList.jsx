import { useEffect, useState } from "react";
import { projectService } from "../services/projectService";

import DataTable from "./common/DataTable";
import Loading from "./common/Loading";
import ErrorMessage from "./common/ErrorMessage";
import Button from "./common/Button";

import { useAuth } from "../context/AuthContext";

function ProjectList({ onEdit }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { hasPermission } = useAuth();

  const loadProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await projectService.getProjects();

      if (!response.ok) {
        throw new Error(
          "Failed to load projects."
        );
      }

      const data = await response.json();

      setProjects(data.results || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id) => {
      if (!window.confirm("Delete this project?")) {
        return;
      }

      try {
        const response =
          await projectService.deleteProject(id);

        if (!response.ok) {
          throw new Error(
            "Failed to delete project."
          );
        }

        setProjects((current) =>
          current.filter(
            (project) => project.id !== id
          )
        );
      } catch (error) {
        setError(error.message);
      }
    };

  const columns = [
    {
      key: "name",
      label: "Project",
    },

    {
      key: "description",
      label: "Description",
      render: (project) =>
        project.description || "-",
    },

    {
      key: "start_date",
      label: "Start Date",
    },

    {
      key: "end_date",
      label: "End Date",
      render: (project) =>
        project.end_date || "-",
    },

    {
      key: "is_active",
      label: "Status",
      render: (project) => (
        <span
          className={
            project.is_active
              ? "status-active"
              : "status-inactive"
          }
        >
          {project.is_active
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
  ];

  const canEdit = hasPermission(
    "employees.change_project"
  );

  const canDelete = hasPermission(
    "employees.delete_project"
  );

  if (canEdit || canDelete) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (project) => (
        <div className="table-actions">

          {canEdit && (
            <Button
              variant="secondary"
              onClick={() => onEdit(project)}
            >
              Edit
            </Button>
          )}

          {canDelete && (
            <Button
              variant="danger"
              onClick={() =>
                handleDelete(project.id)
              }
            >
              Delete
            </Button>
          )}

        </div>
      ),
    });
  }

  if (loading) {
    return (
      <Loading message="Loading projects..." />
    );
  }

  return (
    <section>
      <ErrorMessage message={error} />

      <DataTable
        columns={columns}
        data={projects}
        emptyMessage="No projects found."
      />
    </section>
  );
}

export default ProjectList;