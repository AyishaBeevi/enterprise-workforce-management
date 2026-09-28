import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

function EmployeesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const { hasPermission } = useAuth();

  const handleSaved = () => {
    setSelectedEmployee(null);
    setRefresh((current) => current + 1);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Employees</h1>
        <p>
          Manage your organization's workforce.
        </p>
      </div>

      {hasPermission("employees.add_employee") && (
        <EmployeeForm
          employee={selectedEmployee}
          onSaved={handleSaved}
          onCancel={() => setSelectedEmployee(null)}
        />
      )}

      <EmployeeList
        key={refresh}
        onEdit={setSelectedEmployee}
      />
    </div>
  );
}

export default EmployeesPage;