import { useEffect, useState } from "react";

import { departmentService } from "../services/departmentService";

import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

import { useAuth } from "../context/AuthContext";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { hasPermission } = useAuth();

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await departmentService.getDepartments();

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      const data = await response.json();

      setDepartments(data.results || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) {
      return;
    }

    try {
      const response =
        await departmentService.deleteDepartment(id);

      if (!response.ok) {
        throw new Error(
          `Delete failed: ${response.status}`
        );
      }

      setDepartments((current) =>
        current.filter(
          (department) => department.id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Loading message="Loading departments..." />
    );
  }

  const columns = [
    {
      key: "name",
      label: "Department",
    },
    {
      key: "description",
      label: "Description",
    },
  ];

  if (
    hasPermission("employees.change_department") ||
    hasPermission("employees.delete_department")
  ) {
    columns.push({
      key: "actions",
      label: "Actions",

      render: (department) => (
        <div className="table-actions">
          {hasPermission(
            "employees.change_department"
          ) && (
            <Button
              variant="secondary"
              onClick={() => {
                // Edit functionality can be added here
              }}
            >
              Edit
            </Button>
          )}

          {hasPermission(
            "employees.delete_department"
          ) && (
            <Button
              variant="danger"
              onClick={() =>
                deleteDepartment(department.id)
              }
            >
              Delete
            </Button>
          )}
        </div>
      ),
    });
  }

  return (
    <div>
      <ErrorMessage message={error} />

      <DataTable
        columns={columns}
        data={departments}
        emptyMessage="No departments found."
      />
    </div>
  );
}

export default DepartmentList;