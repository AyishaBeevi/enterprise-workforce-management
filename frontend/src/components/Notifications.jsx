import { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import DataTable from "./common/DataTable";
import Loading from "./common/Loading";
import ErrorMessage from "./common/ErrorMessage";
import Button from "./common/Button";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await notificationService.getNotifications();

      if (!response.ok) {
        throw new Error("Failed to load notifications.");
      }

      const data = await response.json();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response =
         await notificationService.markAsRead(id);

      if (!response.ok) {
        throw new Error("Failed to mark notification as read.");
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loading message="Loading notifications..." />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>
          View your notifications and manage unread messages.
        </p>
      </div>

      <div className="notification-summary">
        <span>Unread Notifications</span>
        <strong>{unreadCount}</strong>
      </div>

      <ErrorMessage message={error} />

      <DataTable
        columns={[
          {
            key: "message",
            label: "Notification",
            render: (notification) => (
              <div
                className={
                  notification.is_read
                    ? "notification-read"
                    : "notification-unread"
                }
              >
                {notification.message}
              </div>
            ),
          },
          {
            key: "created_at",
            label: "Date",
            render: (notification) =>
              new Date(
                notification.created_at
              ).toLocaleString(),
          },
          {
            key: "status",
            label: "Status",
            render: (notification) => (
              <span
                className={
                  notification.is_read
                    ? "notification-status read"
                    : "notification-status unread"
                }
              >
                {notification.is_read ? "Read" : "Unread"}
              </span>
            ),
          },
          {
            key: "action",
            label: "Action",
            render: (notification) =>
              notification.is_read ? (
                <span className="notification-done">
                  —
                </span>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() =>
                    markAsRead(notification.id)
                  }
                >
                  Mark as read
                </Button>
              ),
          },
        ]}
        data={notifications}
        emptyMessage="No notifications."
      />
    </div>
  );
}

export default Notifications;