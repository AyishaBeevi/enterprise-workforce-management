import { useEffect, useState } from "react";

import DataTable from "../components/common/DataTable"; 
import Button from "../components/common/Button"; 
import Loading from "../components/common/Loading"; 
import ErrorMessage from "../components/common/ErrorMessage";

import { employeeService } from "../services/employeeService";
import { assetService } from "../services/assetService";
import {
  assetAssignmentService,
} from "../services/assignmentService";

import { useAuth } from "../context/AuthContext";

function AssetAssignmentsPage() {
  const [assignments, setAssignments] =
    useState([]);

  const [employees, setEmployees] =
    useState([]);

  const [assets, setAssets] =
    useState([]);

  const [employee, setEmployee] =
    useState("");

  const [asset, setAsset] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const { hasPermission } = useAuth();

  const canView = hasPermission(
    "employees.view_assetassignment"
  );

  const canAdd = hasPermission(
    "employees.add_assetassignment"
  );

  const canReturn = hasPermission(
    "employees.change_assetassignment"
  );

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
        const [
        assignmentsResponse,
        employeesResponse,
        assetsResponse,
        ] = await Promise.all([
        assetAssignmentService.getAssignments(),
        employeeService.getEmployees(),
        assetService.getAssets(),
        ]);

        if (
        !assignmentsResponse.ok ||
        !employeesResponse.ok ||
        !assetsResponse.ok
        ) {
        throw new Error(
            "Failed to load asset assignment data."
        );
        }

        const assignmentsData =
        await assignmentsResponse.json();

        const employeesData =
        await employeesResponse.json();

        const assetsData =
        await assetsResponse.json();

        setAssignments(
        assignmentsData.results || assignmentsData
        );

        setEmployees(
        employeesData.results || employeesData
        );

        setAssets(
        assetsData.results || assetsData
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

    if (!employee || !asset) {
        setError(
        "Employee and asset are required."
        );
        return;
    }

    try {
        const response =
        await assetAssignmentService.createAssignment({
            employee: Number(employee),
            asset: Number(asset),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.non_field_errors?.[0] ||
            data.asset?.[0] ||
            data.detail ||
            "Failed to assign asset."
        );
        }

        setEmployee("");
        setAsset("");

        loadData();
    } catch (error) {
        setError(error.message);
    }
    };

  const handleReturn = async (id) => {
    if (
        !window.confirm(
        "Mark this asset as returned?"
        )
    ) {
        return;
    }

    try {
        const response =
        await assetAssignmentService.returnAsset(id);

        if (!response.ok) {
        const text = await response.text();

        throw new Error(
            text.includes("<!DOCTYPE")
            ? "Unable to return asset."
            : "Failed to return asset."
        );
        }

        loadData();
    } catch (error) {
        setError(error.message);
    }
    };


  const columns = [
    {
      key: "asset",
      label: "Asset",
      render: (assignment) =>
        assignment.asset_details
          ? `${assignment.asset_details.asset_id} - ${assignment.asset_details.name}`
          : assignment.asset || "-",
    },

    {
      key: "employee",
      label: "Employee",
      render: (assignment) =>
        assignment.employee_details?.name ||
        assignment.employee ||
        "-",
    },

    {
      key: "assigned_at",
      label: "Assigned At",
    },

    {
      key: "returned_at",
      label: "Returned At",
      render: (assignment) =>
        assignment.returned_at || "-",
    },
  ];

  if (canReturn) {
    columns.push({
      key: "actions",
      label: "Actions",

      render: (assignment) =>
        assignment.returned_at ? (
          <span className="status-inactive">
            Returned
          </span>
        ) : (
          <Button
            variant="secondary"
            onClick={() =>
              handleReturn(assignment.id)
            }
          >
            Return
          </Button>
        ),
    });
  }

  return (
    <div>
      <div className="page-header">
        <h1>Asset Assignments</h1>

        <p>
          Assign company assets to employees and
          manage returns.
        </p>
      </div>

      <ErrorMessage message={error} />

      {canAdd && (
        <section className="form-card">
          <div className="page-section-header">
            <h2>Assign Asset</h2>

            <p>
              Assign an available asset to an employee.
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
                <label>Asset</label>

                <select
                  value={asset}
                  onChange={(e) =>
                    setAsset(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select Asset
                  </option>

                  {assets
                    .filter(
                      (item) => item.is_active
                    )
                    .map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.asset_id} -{" "}
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit">
                Assign Asset
              </Button>
            </div>
          </form>
        </section>
      )}

      {canView && (
        <>
          {loading ? (
            <Loading message="Loading asset assignments..." />
          ) : (
            <section>
              <div className="page-section-header">
                <h2>Asset Assignment History</h2>
              </div>

              <DataTable
                columns={columns}
                data={assignments}
                emptyMessage="No asset assignments found."
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default AssetAssignmentsPage;