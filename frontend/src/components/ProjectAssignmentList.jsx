import { useEffect, useState } from "react";
import { projectAssignmentService } from "../services/assignmentService";

function ProjectAssignmentList({ refresh }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssignments = async () => {
    const response = await projectAssignmentService.getAssignments();

    if (response.ok) {
      const data = await response.json();
      setAssignments(data.results || data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAssignments();
  }, [refresh]);

  if (loading) {
    return <p>Loading assignments...</p>;
  }

  return (
    <div>
      <h2>Project Assignments</h2>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Project</th>
            <th>Role</th>
            <th>Assigned At</th>
          </tr>
        </thead>

        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.employee}</td>
              <td>{assignment.project}</td>
              <td>{assignment.role}</td>
              <td>{assignment.assigned_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProjectAssignmentList;