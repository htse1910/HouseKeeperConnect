import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed
function FamilyNickname({ familyID }) {
  const [nickname, setNickname] = useState(`Gia đình ${familyID}`);

  useEffect(() => {
    const fetchNickname = async () => {
      const authToken = localStorage.getItem("authToken"); // ✅ Retrieve auth token

      if (!authToken) {
        console.error("Lỗi: Không tìm thấy authToken trong localStorage.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/Families/GetFamily?id=${familyID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // ✅ Include auth token
          },
        });

        if (!response.ok) throw new Error("Lỗi khi lấy thông tin gia đình");

        const data = await response.json();
        setNickname(`Gia đình ${data.nickname}` || `Gia đình ${familyID}`); // Default to original format if no nickname exists
      } catch (error) {
        console.error(error);
      }
    };

    fetchNickname();
  }, [familyID]);

  return (
    <span>
      <FaUser className="me-1" /> {nickname}
    </span>
  );
}

export default FamilyNickname;
