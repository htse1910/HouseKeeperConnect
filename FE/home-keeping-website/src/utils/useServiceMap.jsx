import { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig";

const useServiceMap = () => {
  const [serviceMap, setServiceMap] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Service/ServiceList`);
        if (!res.ok) throw new Error("Failed to fetch service list");
        const services = await res.json();

        const map = {};
        services.forEach(service => {
          if (service.status === 1) {
            map[service.serviceID] = service.serviceName;
          }
        });

        setServiceMap(map);
      } catch (err) {
        console.error("❌ Failed to load service map:", err);
      }
    };

    fetchServices();
  }, []);

  return serviceMap;
};

export default useServiceMap;
