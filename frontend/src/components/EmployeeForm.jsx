import { useEffect, useState } from "react";
import { employeeService } from "../services/employeeService";

import DepartmentSelect from "./DepartmentSelect";
import Button from "./common/Button";
import ErrorMessage from "./common/ErrorMessage";

function EmployeeForm({
  employee,
  onSaved,
  onCancel,
}) {
  const [form, setForm] = useState({
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    salary: "",
    department: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (employee) {
      setForm({
        employee_id: employee.employee_id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone || "",
        salary: employee.salary || "",
        department: employee.department,
      });
    } else {
      setForm({
        employee_id: "",
        name: "",
        email: "",
        phone: "",
        salary: "",
        department: "",
      });
    }
  }, [employee]);

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
    let response;

    if (employee) {
      response = await employeeService.updateEmployee(
        employee.id,
        form
      );
    } else {
      response = await employeeService.createEmployee(form);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail ||
        "Unable to save employee."
      );
    }

    onSaved();
  } catch (error) {
    setError(error.message);
  }
};

  return (
    <section className="form-card">
      <div className="page-section-header">
        <div>
          <h2>
            {employee
              ? "Edit Employee"
              : "Add Employee"}
          </h2>

          <p>
            {employee
              ? "Update employee information."
              : "Create a new employee record."}
          </p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form
        className="employee-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-field">
            <label>Employee ID</label>

            <input
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Phone</label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Salary</label>

            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Department</label>

            <DepartmentSelect
              value={form.department}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit">
            {employee
              ? "Update Employee"
              : "Add Employee"}
          </Button>

          {employee && (
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

export default EmployeeForm;