import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

function JobName({ jobID }) {
  const [jobName, setJobName] = useState(`Công việc ${jobID}`);

  useEffect(() => {
    const fetchJobName = async () => {
      const authToken = localStorage.getItem("authToken"); // ✅ Get auth token

      if (!authToken) {
        console.error("Lỗi: Không tìm thấy authToken trong localStorage.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/Job/GetJobByID?id=${jobID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // ✅ Include auth token
          },
        });

        if (!response.ok) throw new Error("Lỗi khi lấy thông tin công việc");

        const data = await response.json();
        setJobName(data.jobName || `Công việc ${jobID}`); // ✅ Use job name if available
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobName();
  }, [jobID]);

  return <span className="fw-bold">{jobName}</span>;
}

export default JobName;
