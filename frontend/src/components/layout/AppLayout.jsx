import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="main-section">
        <Navbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;