import { useState } from "react";
import { departmentService } from "../services/departmentService";

import Button from "./common/Button";
import ErrorMessage from "./common/ErrorMessage";

import { useAuth } from "../context/AuthContext";

function DepartmentForm({ onSaved }) {
  const { hasPermission } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");

  if (!hasPermission("employees.add_department")) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  try {
    const response =
      await departmentService.createDepartment(form);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
        data.name?.[0] ||
        "Failed to create department."
      );
    }

    setForm({
      name: "",
      description: "",
    });

    onSaved();
  } catch (error) {
    setError(error.message);
  }
};

  return (
    <section className="form-card">
      <div className="page-section-header">
        <div>
          <h2>Add Department</h2>
          <p>
            Create a department for your organization.
          </p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form
        className="department-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-field">
            <label>Department Name</label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Human Resources"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Description</label>

            <textarea
              name="description"
              placeholder="Department description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit">
            Add Department
          </Button>
        </div>
      </form>
    </section>
  );
}

export default DepartmentForm;