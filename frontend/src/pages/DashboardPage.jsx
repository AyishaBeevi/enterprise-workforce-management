import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";

import StatCard from "../components/common/StatCard";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await dashboardService.getDashboard();

      if (!response.ok) {
        throw new Error("Failed to load dashboard.");
      }

      const data = await response.json();

      setDashboard(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your workforce and company
            resources.
          </p>
        </div>

        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <ErrorMessage message={error} />

      {dashboard && (
        <>
          <div className="dashboard-grid">
            <StatCard
              title="Employees"
              value={dashboard.employees}
              description="Total employees"
            />

            <StatCard
              title="Departments"
              value={dashboard.departments}
              description="Active departments"
            />

            <StatCard
              title="Projects"
              value={dashboard.projects}
              description="Total projects"
            />

            <StatCard
              title="Assets"
              value={dashboard.assets}
              description="Company assets"
            />
          </div>

          <div className="dashboard-section">
            <h2>Today's Overview</h2>

            <div className="dashboard-grid">
              <StatCard
                title="Present Today"
                value={dashboard.present_today}
                description="Attendance"
              />

              <StatCard
                title="On Leave"
                value={dashboard.leave_today}
                description="Today's leave"
              />

              <StatCard
                title="Pending Leaves"
                value={dashboard.pending_leaves}
                description="Awaiting approval"
              />

              <StatCard
                title="Notifications"
                value={dashboard.unread_notifications}
                description="Unread notifications"
              />
            </div>
          </div>

          <div className="dashboard-info-grid">
            <div className="dashboard-info-card">
              <h3>Workforce</h3>

              <p>
                {dashboard.present_today} employees
                are marked present today.
              </p>

              <a href="/employees">
                View employees
              </a>
            </div>

            <div className="dashboard-info-card">
              <h3>Leave Requests</h3>

              <p>
                {dashboard.pending_leaves} leave
                requests are waiting for review.
              </p>

              <a href="/leave">
                View leave requests
              </a>
            </div>

            <div className="dashboard-info-card">
              <h3>Assets</h3>

              <p>
                {dashboard.assets} assets are
                currently registered.
              </p>

              <a href="/assets">
                View assets
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;