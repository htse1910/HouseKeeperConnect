import { useState } from "react";
import UserAvatar from "./UserAvatar";
import AccountStatusBadge from "./AccountStatusBadge";

const UserTableRow = ({ user, onSelect, onChangeStatus, onRequestPasswordResetModal, getRole, getGender }) => {
  return (
    <tr className="text-center align-middle" style={{ backgroundColor: user.accountID % 2 === 0 ? "#ffffff" : "#f9fcff" }}>
      <td>{user.accountID}</td>
      <td><UserAvatar src={user.localProfilePicture || user.googleProfilePicture} /></td>
      <td className="fw-semibold text-dark">{user.name}</td>
      <td className="text-info">{user.email}</td>
      <td style={{ color: user.roleID === 1 ? "#0d6efd" : user.roleID === 2 ? "#198754" : "#ffc107" }}>
        {getRole(user.roleID)}
      </td>
      <td className="text-secondary">{getGender(user.gender)}</td>
      <td><AccountStatusBadge status={user.status} /></td>
      <td className="text-muted">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
      <td>
        <button className="btn btn-sm btn-outline-primary" onClick={() => onSelect(user)}>Xem</button>
      </td>
      <td>
        <button className="btn btn-sm btn-warning" onClick={() => onChangeStatus(user.accountID)}>
          Thay đổi
        </button>
      </td>
      <td>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onRequestPasswordResetModal(user)}>
          Đặt lại
        </button>
      </td>
    </tr>
  );
};


export default UserTableRow;
