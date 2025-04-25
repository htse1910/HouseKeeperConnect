const AccountStatusBadge = ({ status }) => {
    switch (status) {
      case 1: return <span className="badge bg-success">Hoạt động</span>;
      case 0: return <span className="badge bg-danger">Không hoạt động</span>;
      case 2: return <span className="badge bg-warning text-dark">Đang chờ</span>;
      default: return <span className="badge bg-secondary">Không xác định</span>;
    }
  };
  
  export default AccountStatusBadge;
  