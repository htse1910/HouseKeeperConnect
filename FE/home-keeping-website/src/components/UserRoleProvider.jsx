import React, { createContext, useState } from "react";

export const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [userRole, setUserRoleState] = useState(localStorage.getItem("userRole") || "Guest");

  // Cập nhật userRole vào localStorage + setState cùng lúc
  const setUserRole = (role) => {
    localStorage.setItem("userRole", role);
    setUserRoleState(role);
  };

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
}
