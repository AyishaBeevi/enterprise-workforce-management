import { useEffect, useState } from "react";
import { leaveService } from "../services/leaveService";

import DataTable from "./common/DataTable";
import Loading from "./common/Loading";
import ErrorMessage from "./common/ErrorMessage";

function LeaveList({ refresh }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaves = async () => {
  setLoading(true);
  setError("");

  try {
    const response =
      await leaveService.getMyLeaves();

    if (!response.ok) {
      throw new Error(
        "Failed to load leave requests."
      );
    }

    const data = await response.json();

    setLeaves(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadLeaves();
  }, [refresh]);

  const columns = [
    {
      key: "start_date",
      label: "Start",
    },

    {
      key: "end_date",
      label: "End",
    },

    {
      key: "reason",
      label: "Reason",
    },

    {
      key: "status",
      label: "Status",
      render: (leave) => (
        <span
          className={`leave-status leave-${leave.status?.toLowerCase()}`}
        >
          {leave.status}
        </span>
      ),
    },

    {
      key: "created_at",
      label: "Created",
      render: (leave) =>
        new Date(
          leave.created_at
        ).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <Loading message="Loading leave requests..." />
    );
  }

  return (
    <section className="leave-section">
      <div className="page-section-header">
        <h2>My Leave Requests</h2>

        <p>
          Track your submitted leave requests.
        </p>
      </div>

      <ErrorMessage message={error} />

      <DataTable
        columns={columns}
        data={leaves}
        emptyMessage="You have no leave requests."
      />
    </section>
  );
}

export default LeaveList;