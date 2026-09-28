import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ open, onClose }) {
  const { hasPermission } = useAuth();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Employees",
      path: "/employees",
      permission: "employees.view_employee",
    },
    {
      name: "Departments",
      path: "/departments",
      permission: "employees.view_department",
    },
    {
      name: "Projects",
      path: "/projects",
      permission: "employees.view_project",
    },
    {
      name: "Assets",
      path: "/assets",
      permission: "employees.view_asset",
    },
    {
      name: "Project Assignments",
      path: "/project-assignments",
      permission: "employees.view_projectassignment",
    },
    {
      name: "Asset Assignments",
      path: "/asset-assignments",
      permission: "employees.view_assetassignment",
    },
    {
      name: "Attendance",
      path: "/attendance",
      permission: "employees.view_attendance",
    },
    {
      name: "Leave",
      path: "/leave",
      permission: "employees.view_leaverequest",
    },
    {
      name: "Notifications",
      path: "/notifications",
    },
  ];

  const visibleLinks = links.filter(
    (link) =>
      !link.permission ||
      hasPermission(link.permission)
  );

  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div>
            <div className="sidebar-logo">
              EAWMS
            </div>

            <div className="sidebar-subtitle">
              Enterprise Management
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <nav>
          {visibleLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;