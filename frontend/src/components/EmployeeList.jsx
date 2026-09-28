import { useEffect, useState } from "react";
import { employeeService } from "../services/employeeService";

import DataTable from "./common/DataTable";
import Loading from "./common/Loading";
import ErrorMessage from "./common/ErrorMessage";
import Button from "./common/Button";

import { useAuth } from "../context/AuthContext";

function EmployeeList({ onEdit }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const loadEmployees = async (url = null) => {
  setLoading(true);
  setError("");

  try {
    const response = url
      ? await employeeService.getEmployeesPage(url)
      : await employeeService.getEmployees(
          `?search=${encodeURIComponent(search)}`
        );

    if (!response.ok) {
      throw new Error("Failed to load employees.");
    }

    const data = await response.json();

    setEmployees(data.results || data);
    setNext(data.next || null);
    setPrevious(data.previous || null);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    loadEmployees();
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this employee?")) {
    return;
  }

  try {
    const response = await employeeService.deleteEmployee(id);

    if (!response.ok) {
      throw new Error("Failed to delete employee.");
    }

    setEmployees((current) =>
      current.filter(
        (employee) => employee.id !== id
      )
    );
  } catch (error) {
    setError(error.message);
  }
};

  const {
    hasPermission,
  } = useAuth();

  const columns = [
  {
    key: "employee_id",
    label: "Employee ID",
  },

  {
    key: "name",
    label: "Name",
  },

  {
    key: "email",
    label: "Email",
  },

  {
    key: "department_details",
    label: "Department",
    render: (employee) =>
      employee.department_details?.name || "-",
  },
];

if (
  hasPermission("employees.change_employee") ||
  hasPermission("employees.delete_employee")
) {
  columns.push({
    key: "actions",
    label: "Actions",
    render: (employee) => (
      <div className="table-actions">

        {hasPermission("employees.change_employee") && (
          <Button
            variant="secondary"
            onClick={() => onEdit(employee)}
          >
            Edit
          </Button>
        )}

        {hasPermission("employees.delete_employee") && (
          <Button
            variant="danger"
            onClick={() => handleDelete(employee.id)}
          >
            Delete
          </Button>
        )}

      </div>
    ),
  });
}

  return (
    <section>
      <div className="page-section-header">
        
      </div>

      <form
        className="search-form"
        onSubmit={handleSearchSubmit}
      >
        <input
          type="search"
          placeholder="Search employees..."
          value={search}
          onChange={handleSearch}
        />

        <Button type="submit">
          Search
        </Button>
      </form>

      <ErrorMessage message={error} />

      {loading ? (
        <Loading message="Loading employees..." />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={employees}
            emptyMessage="No employees found."
          />

          <div className="pagination">
            <Button
              variant="secondary"
              disabled={!previous}
              onClick={() =>
                loadEmployees(previous)
              }
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              disabled={!next}
              onClick={() =>
                loadEmployees(next)
              }
            >
              Next
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

export default EmployeeList;