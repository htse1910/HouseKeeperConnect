import React, { useContext } from "react";
import { UserRoleContext } from "../components/UserRoleProvider";

function RoleSelector() {
  const { setUserRole } = useContext(UserRoleContext);  // Đúng tên biến

  return (
    <div className="role-selector">
      <button onClick={() => setUserRole("guest")}>Guest</button>
      <button onClick={() => setUserRole("housekeeper")}>Housekeeper</button>
      <button onClick={() => setUserRole("family")}>Family</button>
      <button onClick={() => setUserRole("admin")}>Admin</button>
    </div>
  );
}

export default RoleSelector;
