import React from "react";
import JobCard from "./JobCard";

const JobList = ({
  jobs,
  jobStatusMap,
  onEdit,
  onDelete,
  onView,
  onCancel
}) => {
  return (
    <div className="d-flex flex-column gap-3">
      {jobs.map((job) => (
        <JobCard
          key={job.jobID}
          job={job}
          jobStatusMap={jobStatusMap}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};

export default JobList;
