import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig"; // ✅ Added this

const useFamilyJobs = ({ accountID, authToken, t }) => {
  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [housekeepers, setHousekeepers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNoProfile, setIsNoProfile] = useState(false);
  const [isNoJob, setIsNoJob] = useState(false);

  useEffect(() => {
    if (!authToken || !accountID) {
      setError(t("error.error_auth"));
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json"
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setIsNoProfile(false);
      setIsNoJob(false);

      let tempServices = [];

      try {
        const accRes = await axios.get(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, { headers });
        const account = accRes.data;
        if (!account?.accountID) throw new Error(t("error.error_auth"));

        const famRes = await axios.get(`${API_BASE_URL}/Families/SearchFamilyByAccountId?accountId=${accountID}`, { headers });
        const family = famRes.data?.[0];
        if (!family) {
          setIsNoProfile(true);
          throw new Error("NO_PROFILE");
        }

        try {
          const [servicesRes, totalAccRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/Service/ServiceList`, { headers }).catch(() => ({ data: [] })),
            axios.get(`${API_BASE_URL}/Account/TotalAccount`, { headers }).catch(() => ({ data: {} })),
          ]);

          tempServices = servicesRes.data || [];
          setServices(tempServices);
          setHousekeepers(totalAccRes.data?.totalHousekeepers || 0);
        } catch (fetchErr) {
          console.warn("Không thể lấy service/housekeeper:", fetchErr);
        }

        try {
          const jobRes = await axios.get(`${API_BASE_URL}/Job/GetJobsByAccountID?accountId=${accountID}&pageNumber=1&pageSize=1000000`, { headers });
          const jobList = jobRes.data;

          if (!Array.isArray(jobList)) {
            setJobs([]);
            return;
          }

          const detailPromises = jobList.map((job) =>
            axios.get(`${API_BASE_URL}/Job/GetJobDetailByID?id=${job.jobID}`, { headers })
              .then((res) => res.data)
              .catch(() => null)
          );

          const detailedJobs = await Promise.all(detailPromises);
          const validJobs = detailedJobs.filter((j) => j !== null);

          const formattedJobs = validJobs.map((jobDetail) => {
            const originalJob = jobList.find((j) => j.jobID === jobDetail.jobID);
            const createDate = originalJob?.createdAt || jobDetail.createdAt;
            const serviceIDs = jobDetail.serviceIDs || [];

            const serviceTypes = Array.from(
              new Set(serviceIDs.map((id) => {
                const s = tempServices.find((s) => s.serviceID === id);
                return s?.serviceType;
              }))
            ).filter(Boolean);

            return {
              jobID: jobDetail.jobID,
              jobName: jobDetail.jobName,
              createdDate: createDate,
              startDate: new Date(jobDetail.startDate).toLocaleDateString("vi-VN"),
              endDate: new Date(jobDetail.endDate).toLocaleDateString("vi-VN"),
              status: jobDetail.status,
              salary: jobDetail.price,
              location: jobDetail.location,
              description: jobDetail.description,
              serviceIDs: serviceIDs,
              serviceTypes: serviceTypes,
              jobType: jobDetail.jobType, // <-- Add this line
            };
          });

          setJobs(formattedJobs);
          if (formattedJobs.length === 0) setIsNoJob(true);
        } catch (jobErr) {
          setJobs([]);
        }

      } catch (err) {
        if (err.message !== "NO_PROFILE") {
          setError(t("error.error_loading"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountID, authToken, t]);

  return {
    jobs,
    services,
    housekeepers,
    loading,
    error,
    isNoProfile,
    isNoJob,
    setJobs,
  };
};

export default useFamilyJobs;
