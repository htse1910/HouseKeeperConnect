import { useEffect, useState } from "react";
import axios from "axios";

const useFamilyJobs = ({ isDemo, accountID, authToken, t }) => {
  const [jobs, setJobs] = useState([]);
  const [services, setServices] = useState([]);
  const [jobServices, setJobServices] = useState([]);
  const [housekeepers, setHousekeepers] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNoProfile, setIsNoProfile] = useState(false);
  const [isNoJob, setIsNoJob] = useState(false);

  useEffect(() => {
    if (isDemo) {
      const generateFakeJobs = () => {
        const titles = [
          "Dọn dẹp nhà cửa", "Nấu ăn gia đình", "Chăm sóc trẻ em",
          "Giặt giũ quần áo", "Vệ sinh nhà tắm", "Rửa chén bát",
          "Dọn dẹp sân vườn", "Ủi quần áo", "Nấu tiệc cuối tuần", "Tổng vệ sinh ngày lễ"
        ];
        const locations = ["Quận 1", "Quận 3", "Gò Vấp", "Tân Bình", "Bình Thạnh", "Thủ Đức"];
        const types = ["Dọn dẹp", "Nấu ăn"];
        const statuses = [0, 1, 2];
        return Array.from({ length: 40 }, (_, i) => ({
          jobID: i + 1,
          title: titles[Math.floor(Math.random() * titles.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          salary: Math.floor(Math.random() * 100000) + 50000,
          jobName: types[Math.floor(Math.random() * types.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 15) * 86400000).toISOString()
        }));
      };

      setJobs(generateFakeJobs());
      setLoading(false);
      setError(null);
      return;
    }

    if (!authToken || !accountID) {
      setError(t("error_auth"));
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json"
    };

    setLoading(true);
    setError(null);
    setIsNoProfile(false);
    setIsNoJob(false);

    let tempServices = [];
    let tempJobServices = [];

    axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
      .then((res) => {
        const account = res.data;
        if (!account?.accountID) throw new Error(t("error_auth"));
        return axios.get(`http://localhost:5280/api/Families/SearchFamilyByAccountId?accountId=${accountID}`, { headers });
      })
      .then((res) => {
        const family = res.data?.[0];
        if (!family) {
          setIsNoProfile(true);
          throw new Error("NO_PROFILE");
        }

        const getJobServicesSafe = () =>
          axios.get(`http://localhost:5280/api/Job_Service/Job_ServiceList`, { headers })
            .then(res => Array.isArray(res.data) ? res.data : [])
            .catch(() => []);

        return Promise.all([
          axios.get(`http://localhost:5280/api/Service/ServiceList`, { headers }),
          getJobServicesSafe(),
          axios.get(`http://localhost:5280/api/Account/TotalAccount`, { headers }),
        ]);
      })
      .then(([servicesRes, jobServicesRes, totalAccRes]) => {
        tempServices = servicesRes.data || [];
        tempJobServices = jobServicesRes || [];
        setServices(tempServices);
        setJobServices(tempJobServices);
        setHousekeepers(totalAccRes.data?.totalHousekeepers || 0);

        return axios.get(`http://localhost:5280/api/Job/GetJobsByAccountID?accountId=${accountID}`, { headers });
      })
      .then((jobRes) => {
        const rawJobs = jobRes.data || [];

        const serviceMap = {};
        tempJobServices.forEach(({ jobID, serviceID }) => {
          if (!serviceMap[jobID]) serviceMap[jobID] = [];
          serviceMap[jobID].push(serviceID);
        });

        const enriched = rawJobs.map((job) => {
          const serviceIDs = serviceMap[job.jobID] || [];
          const serviceNames = serviceIDs
            .map(id => tempServices.find(s => s.serviceID === id)?.serviceName)
            .filter(Boolean);
          return { ...job, jobTypeList: serviceNames, jobType: serviceNames.join(", ") || "Không rõ" };
        });

        setJobs(enriched);
        if (enriched.length === 0) setIsNoJob(true);
      })
      .catch((err) => {
        if (err.message !== "NO_PROFILE") {
          console.error("API Error:", err);
          setError(t("error_loading"));
        }
      })
      .finally(() => {
        setLoading(false);
      });

  }, [isDemo, accountID, authToken, t]);

  return {
    jobs,
    services,
    jobServices,
    housekeepers,
    loading,
    error,
    isNoProfile,
    isNoJob,
    setJobs,
  };
};

export default useFamilyJobs;
