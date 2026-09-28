import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import LeaveRequestForm from "../components/LeaveRequestForm";
import LeaveList from "../components/LeaveList";
import LeaveApprovals from "../components/LeaveApprovals";

function LeavePage() {
  const [refresh, setRefresh] = useState(0);

  const { hasPermission } = useAuth();

  const handleSaved = () => {
    setRefresh((value) => value + 1);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Leave Management</h1>

        <p>
          Request leave, track your requests,
          and review approvals.
        </p>
      </div>

      <LeaveRequestForm
        onSaved={handleSaved}
      />

      <LeaveList
        refresh={refresh}
      />

      {hasPermission("employees.change_leaverequest") && (
        <LeaveApprovals />
      )}
    </div>
  );
}

export default LeavePage;