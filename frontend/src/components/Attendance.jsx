import { useEffect, useState } from "react";
import { attendanceService } from "../services/attendanceService";

import DataTable from "./common/DataTable";
import Button from "./common/Button";
import Loading from "./common/Loading";
import ErrorMessage from "./common/ErrorMessage";

function Attendance() {
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    setLoading(true);
    setError("");

    try {
        const response =
        await attendanceService.getAttendance();

        if (!response.ok) {
        throw new Error(
            "Failed to load attendance."
        );
        }

        const data = await response.json();

        setToday(data.today);
        setHistory(data.history);
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    setError("");

    try {
        const response =
        await attendanceService.checkIn();

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.detail || "Check-in failed."
        );
        }

        setToday(data);

        loadAttendance();
    } catch (error) {
        setError(error.message);
    }
    };

  const handleCheckOut = async () => {
    setError("");

    try {
        const response =
        await attendanceService.checkOut();

        const data = await response.json();

        if (!response.ok) {
        throw new Error(
            data.detail || "Check-out failed."
        );
        }

        setToday(data);

        loadAttendance();
    } catch (error) {
        setError(error.message);
    }
    };

  const historyColumns = [
    {
      key: "date",
      label: "Date",
    },

    {
      key: "check_in",
      label: "Check In",
      render: (record) =>
        record.check_in || "-",
    },

    {
      key: "check_out",
      label: "Check Out",
      render: (record) =>
        record.check_out || "-",
    },

    {
      key: "status",
      label: "Status",
      render: (record) => (
        <span
          className={`attendance-status status-${record.status?.toLowerCase()}`}
        >
          {record.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <Loading message="Loading attendance..." />
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Attendance</h1>

        <p>
          Track your daily attendance and
          attendance history.
        </p>
      </div>

      <ErrorMessage message={error} />

      {/* Today's Attendance */}

      <section className="attendance-today-card">
        <div className="page-section-header">
          <h2>Today's Attendance</h2>

          <p>
            Manage your attendance for today.
          </p>
        </div>

        {today ? (
          <div className="attendance-summary">
            <div className="attendance-info">
              <span className="attendance-label">
                Status
              </span>

              <span
                className={`attendance-status status-${today.status?.toLowerCase()}`}
              >
                {today.status}
              </span>
            </div>

            <div className="attendance-info">
              <span className="attendance-label">
                Check-in
              </span>

              <strong>
                {today.check_in || "-"}
              </strong>
            </div>

            <div className="attendance-info">
              <span className="attendance-label">
                Check-out
              </span>

              <strong>
                {today.check_out || "-"}
              </strong>
            </div>

            <div className="attendance-actions">
              {!today.check_in && (
                <Button
                  onClick={handleCheckIn}
                >
                  Check In
                </Button>
              )}

              {today.check_in &&
                !today.check_out && (
                  <Button
                    onClick={handleCheckOut}
                  >
                    Check Out
                  </Button>
                )}

              {today.check_out && (
                <span className="attendance-complete">
                  Attendance completed
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="attendance-empty">
            <p>
              You haven't checked in today.
            </p>

            <Button onClick={handleCheckIn}>
              Check In
            </Button>
          </div>
        )}
      </section>

      {/* History */}

      <section>
        <div className="page-section-header">
          <h2>Attendance History</h2>

          <p>
            Your previous attendance records.
          </p>
        </div>

        <DataTable
          columns={historyColumns}
          data={history}
          emptyMessage="No attendance records found."
        />
      </section>
    </div>
  );
}

export default Attendance;