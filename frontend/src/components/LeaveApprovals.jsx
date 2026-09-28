import { useEffect, useState } from "react";
import { leaveService } from "../services/leaveService";

import DataTable from "./common/DataTable";
import Button from "./common/Button";
import Loading from "./common/Loading";
import ErrorMessage from "./common/ErrorMessage";

function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadApprovals = async () => {
    setLoading(true);
    setError("");

    try {
        const response =
        await leaveService.getApprovals();

        if (!response.ok) {
        throw new Error(
            "Failed to load leave approvals."
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
    loadApprovals();
  }, []);

  const handleReview = async (id, action) => {
    setError("");

    try {
        const response =
        await leaveService.reviewLeave(
            id,
            action
        );

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.detail ||
            `Failed to ${action} leave request.`
        );
        }

        setLeaves((current) =>
        current.filter(
            (leave) => leave.id !== id
        )
        );
    } catch (error) {
        setError(error.message);
    }
    };

  const columns = [
    {
      key: "employee_name",
      label: "Employee",
    },

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
      key: "actions",
      label: "Actions",
      render: (leave) => (
        <div className="table-actions">
          <Button
            onClick={() =>
              handleReview(
                leave.id,
                "approve"
              )
            }
          >
            Approve
          </Button>

          <Button
            variant="danger"
            onClick={() =>
              handleReview(
                leave.id,
                "reject"
              )
            }
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <Loading message="Loading approvals..." />
    );
  }

  return (
    <section className="leave-section">
      <div className="page-section-header">
        <h2>Leave Approvals</h2>

        <p>
          Review pending employee leave requests.
        </p>
      </div>

      <ErrorMessage message={error} />

      <DataTable
        columns={columns}
        data={leaves}
        emptyMessage="No pending leave requests."
      />
    </section>
  );
}

export default LeaveApprovals;