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

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setIsNoProfile(false);
      setIsNoJob(false);

      let tempServices = [];
      let tempJobServices = [];

      try {
        // B1: Check Account
        const accRes = await axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers });
        const account = accRes.data;
        if (!account?.accountID) throw new Error(t("error_auth"));

        // B2: Check Family Profile
        const famRes = await axios.get(`http://localhost:5280/api/Families/SearchFamilyByAccountId?accountId=${accountID}`, { headers });
        const family = famRes.data?.[0];
        if (!family) {
          setIsNoProfile(true);
          throw new Error("NO_PROFILE");
        }

        // B3: Fetch Services (with fallback nếu lỗi)
        try {
          const [servicesRes, totalAccRes] = await Promise.all([
            axios.get(`http://localhost:5280/api/Service/ServiceList`, { headers }).catch(() => ({ data: [] })),
            axios.get(`http://localhost:5280/api/Account/TotalAccount`, { headers }).catch(() => ({ data: {} })),
          ]);

          tempServices = servicesRes.data || [];
          setServices(tempServices);
          setHousekeepers(totalAccRes.data?.totalHousekeepers || 0);
        } catch (fetchErr) {
          console.warn("Không thể lấy service/housekeeper:", fetchErr);
        }

        // B4: Lấy Job & JobDetail (với try-catch riêng)
        try {
          const jobRes = await axios.get(`http://localhost:5280/api/Job/GetJobsByAccountID?accountId=${accountID}`, { headers });
          const jobList = jobRes.data;

          if (!Array.isArray(jobList)) {
            console.warn("API Job không trả về danh sách hợp lệ.");
            setJobs([]);
            return;
          }

          const detailPromises = jobList.map((job) =>
            axios.get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${job.jobID}`, { headers })
              .then((res) => res.data)
              .catch((err) => {
                console.warn(`Không lấy được chi tiết job ${job.jobID}`, err);
                return null;
              })
          );

          const detailedJobs = await Promise.all(detailPromises);
          const validJobs = detailedJobs.filter((j) => j !== null);

          const formattedJobs = validJobs.map((jobDetail) => {
            const originalJob = jobList.find((j) => j.jobID === jobDetail.jobID);
            const createDate = originalJob?.createdAt || jobDetail.createdAt;

            // Lấy serviceIDs từ response API GetJobDetailByID
            const serviceIDs = jobDetail.serviceIDs || [];

            const serviceNames = serviceIDs.map((id) => {
              const service = tempServices.find((s) => s.serviceID === id);
              return service?.serviceName;
            }).filter(Boolean);

            const serviceTypes = Array.from(
              new Set(
                serviceIDs
                  .map((id) => {
                    const s = tempServices.find((s) => s.serviceID === id);
                    return s?.serviceType;
                  })
              )
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
            };
          });
          console.log("🎯 FORMATTED JOBS:", formattedJobs);

          setJobs(formattedJobs);
          if (formattedJobs.length === 0) setIsNoJob(true);
        } catch (jobErr) {
          console.warn("Không lấy được danh sách job:", jobErr);
          setJobs([]);
        }

      } catch (err) {
        if (err.message !== "NO_PROFILE") {
          console.error("API Error:", err);
          setError(t("error_loading"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isDemo, accountID, authToken, t]);

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
