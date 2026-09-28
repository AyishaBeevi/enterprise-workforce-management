import { useEffect, useState } from "react";
import { departmentService } from "../services/departmentService";

function DepartmentSelect({ value, onChange }) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const response = await departmentService.getDepartments();

      if (response.ok) {
        const data = await response.json();
        setDepartments(data.results || data);
      }
    };

    loadDepartments();
  }, []);

  return (
    <select
      name="department"
      value={value}
      onChange={onChange}
    >
      <option value="">Select Department</option>

      {departments.map((department) => (
        <option
          key={department.id}
          value={department.id}
        >
          {department.name}
        </option>
      ))}
    </select>
  );
}

export default DepartmentSelect;