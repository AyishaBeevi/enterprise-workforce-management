import { useEffect, useState } from "react";
import { assetAssignmentService } from "../services/assignmentService";

function AssetAssignmentList({ refresh }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssignments = async () => {
    const response = await assetAssignmentService.getAssignments();

    if (response.ok) {
      const data = await response.json();
      setAssignments(data.results || data);
    }

    setLoading(false);
  };

  const handleReturn = async (id) => {
    if (!window.confirm("Return this asset?")) {
      return;
    }

    const response = await assetAssignmentService.returnAsset(id);

    if (response.ok) {
      loadAssignments();
    } else {
      const data = await response.json();
      console.error(data);
      alert("Failed to return asset.");
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [refresh]);

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  return (
    <div>
      <h2>Asset Assignments</h2>

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Employee</th>
            <th>Assigned At</th>
            <th>Returned At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>
                {assignment.asset_details
                  ? `${assignment.asset_details.asset_id} - ${assignment.asset_details.name}`
                  : assignment.asset}
              </td>

              <td>
                {assignment.employee_details
                  ? assignment.employee_details.name
                  : assignment.employee}
              </td>

              <td>{assignment.assigned_at}</td>

              <td>{assignment.returned_at || "-"}</td>

              <td>
                {assignment.returned_at ? (
                  <span>Returned</span>
                ) : (
                  <button
                    onClick={() => handleReturn(assignment.id)}
                  >
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetAssignmentList;