import { Modal, Button } from "react-bootstrap";
import UserAvatar from "./UserAvatar";
import AccountStatusBadge from "./AccountStatusBadge";

const UserDetailsModal = ({ user, onClose, getRole, getGender }) => {
  if (!user) return null;

  return (
    <Modal show={!!user} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Thông Tin: {user.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-4 text-center mb-3">
            <UserAvatar src={user.localProfilePicture || user.googleProfilePicture} size={80} />
          </div>
          <div className="col-md-8">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>SĐT:</strong> {user.phone || "Chưa có"}</p>
            <p><strong>Vai trò:</strong> {getRole(user.roleID)}</p>
            <p><strong>Trạng thái:</strong> <AccountStatusBadge status={user.status} /></p>
            <p><strong>Giới tính:</strong> {getGender(user.gender)}</p>
            <p><strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
            <hr />
            <p><strong>Biệt danh:</strong> {user.nickname || "Không có"}</p>
            <p><strong>Địa chỉ:</strong> {user.address || "Không có"}</p>
            <p><strong>Giới thiệu:</strong> {user.introduction || "Không có"}</p>
            <p><strong>Ngân hàng:</strong> {user.bankAccountName || "Không có"}</p>
            <p><strong>Số TK:</strong> {user.bankAccountNumber || "Không có"}</p>
            <p><strong>Provider:</strong> {user.provider || "Không có"}</p>
            <p><strong>Google ID:</strong> {user.googleId || "Không có"}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
