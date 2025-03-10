import React, { createContext, useState, useEffect } from "react";

export const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "guest");

  // Cập nhật userRole vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}