import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../api/api";
import { notificationService } from "../../services/notificationService";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] =
    useState(0);

  const loadUnreadCount = async () => {
    try {
      const response =
            await notificationService.getNotifications();

      if (response.ok) {
        const data = await response.json();

        setUnreadCount(
          data.unread_count || 0
        );
      }
    } catch (error) {
      console.error(
        "Failed to load notifications",
        error
      );
    }
  };

  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(
      loadUnreadCount,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
  logout();
};

  return (
    <header className="navbar">
        <div className="navbar-left">
        <button
        className="mobile-menu-button"
        onClick={onMenuClick}
        >
        ☰
        </button>
        </div>

      <div className="navbar-title">
        <h2>EAWMS</h2>
      </div>

      <div className="navbar-right">
        <button
          className="notification-button"
          onClick={() =>
            navigate("/notifications")
          }
          title="Notifications"
        >
          <span className="notification-icon">
            ♢
          </span>

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>

        <span className="navbar-description">
          Enterprise Asset & Workforce Management
        </span>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;