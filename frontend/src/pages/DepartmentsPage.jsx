import { useState } from "react";

import DepartmentForm from "../components/DepartmentForm";
import DepartmentList from "../components/DepartmentList";

function DepartmentsPage() {
  const [refresh, setRefresh] = useState(0);

  const handleSaved = () => {
    setRefresh((current) => current + 1);
  };

  return (
    <div>

      <DepartmentForm
        onSaved={handleSaved}
      />

      <DepartmentList
        key={refresh}
      />
    </div>
  );
}

export default DepartmentsPage;