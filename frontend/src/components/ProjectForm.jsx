import { useEffect, useState } from "react";
import { projectService } from "../services/projectService";

import Button from "./common/Button";
import ErrorMessage from "./common/ErrorMessage";

import { useAuth } from "../context/AuthContext";

function ProjectForm({
  project,
  onSaved,
  onCancel,
}) {
  const { hasPermission } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const [error, setError] = useState("");

  // ==========================================
  // RBAC
  // ==========================================

  const canAdd = hasPermission(
    "employees.add_project"
  );

  const canEdit = hasPermission(
    "employees.change_project"
  );

  // ==========================================
  // Load project data
  // ==========================================

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        description: project.description || "",
        start_date: project.start_date,
        end_date: project.end_date || "",
        is_active: project.is_active,
      });
    } else {
      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        is_active: true,
      });
    }
  }, [project]);

  // ==========================================
  // Permission check
  // ==========================================

  // Creating a project requires add permission
  if (!project && !canAdd) {
    return null;
  }

  // Editing a project requires change permission
  if (project && !canEdit) {
    return null;
  }

  // ==========================================
  // Handle input changes
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // Submit
  // ==========================================

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  try {
    let response;

    if (project) {
      response = await projectService.updateProject(
        project.id,
        form
      );
    } else {
      response = await projectService.createProject(form);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
          data.name?.[0] ||
          "Failed to save project."
      );
    }

    onSaved();
  } catch (error) {
    setError(error.message);
  }
};

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="form-card">
      <div className="page-section-header">
        <h2>
          {project
            ? "Edit Project"
            : "Add Project"}
        </h2>

        <p>
          {project
            ? "Update project information."
            : "Create a new project."}
        </p>
      </div>

      <ErrorMessage message={error} />

      <form
        className="project-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">

          <div className="form-field">
            <label>Project Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Start Date</label>

            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>End Date</label>

            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />

              Active project
            </label>
          </div>

          <div className="form-field full-width">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Project description"
            />
          </div>

        </div>

        <div className="form-actions">
          <Button type="submit">
            {project
              ? "Update Project"
              : "Add Project"}
          </Button>

          {project && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

export default ProjectForm;