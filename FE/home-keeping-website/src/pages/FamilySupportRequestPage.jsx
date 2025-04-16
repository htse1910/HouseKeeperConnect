import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig";
import { Badge, Spinner } from "react-bootstrap";

const SUPPORT_TYPES = {
  1: "Tài khoản",
  2: "Công việc",
  3: "Xác minh CMND",
  4: "Giao dịch",
};

const SUPPORT_STATUS = {
  1: { label: "Đang xử lý", variant: "warning" },
  2: { label: "Đã xử lý", variant: "success" },
};

const FamilySupportRequestPage = () => {
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/SupportRequest/GetSupportRequestByAccount?id=${accountID}&pageNumber=1&pageSize=100`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error("Lỗi khi tải yêu cầu hỗ trợ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportRequests();
  }, [accountID, authToken]);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Yêu cầu hỗ trợ của bạn</h3>

      {loading ? (
        <Spinner animation="border" />
      ) : requests.length === 0 ? (
        <p>Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Loại</th>
                <th>Nội dung</th>
                <th>Hình ảnh</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req.requestID}>
                  <td>{index + 1}</td>
                  <td>{SUPPORT_TYPES[req.type] || "Không rõ"}</td>
                  <td>{req.content}</td>
                  <td>
                    {req.picture ? (
                      <a href={req.picture} target="_blank" rel="noreferrer">Xem</a>
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td>
                    <Badge bg={SUPPORT_STATUS[req.status]?.variant || "secondary"}>
                      {SUPPORT_STATUS[req.status]?.label || "Không rõ"}
                    </Badge>
                  </td>
                  <td>{new Date(req.createdDate).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FamilySupportRequestPage;
