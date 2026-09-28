import { useState } from "react";

import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";

function ProjectsPage() {
  const [selectedProject, setSelectedProject] =
    useState(null);

  const [refresh, setRefresh] = useState(0);

  const handleSaved = () => {
    setSelectedProject(null);

    setRefresh(
      (current) => current + 1
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1>Projects</h1>

        <p>
          Manage projects and project information.
        </p>
      </div>

      <ProjectForm
        project={selectedProject}
        onSaved={handleSaved}
        onCancel={() =>
          setSelectedProject(null)
        }
      />

      <ProjectList
        key={refresh}
        onEdit={setSelectedProject}
      />
    </div>
  );
}

export default ProjectsPage;