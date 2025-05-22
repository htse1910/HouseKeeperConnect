import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { format } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import PayoutDetailModal from "../components/PayoutDetailModal";
import API_BASE_URL from "../config/apiConfig";

const HouseKeeperPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const PAYOUTS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      const accountID = localStorage.getItem("accountID");
      const token = localStorage.getItem("authToken");

      if (!accountID || !token) {
        toast.error("Bạn chưa đăng nhập.");
        return;
      }

      setLoading(true);

      try {
        const countRes = await axios.get(
          `${API_BASE_URL}/Payout/CountPayoutsByHK?accountID=${accountID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalPayouts(countRes.data);

        const payoutsRes = await axios.get(
          `${API_BASE_URL}/Payout/GetPayoutsByHK?accountID=${accountID}&pageNumber=${currentPage}&pageSize=${PAYOUTS_PER_PAGE}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPayouts(payoutsRes.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalPayouts / PAYOUTS_PER_PAGE);

  const statusMap = {
    1: "Đang chờ",
    2: "Đã thanh toán",
    3: "Từ chối",
  };

  return (
    <div className="container py-4">
      <style>{`
        .scroll-shadow {
          max-height: 600px;
          overflow-y: auto;
          padding-right: 8px;
        }
        .scroll-shadow::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-shadow::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.15);
          border-radius: 3px;
        }
      `}</style>

      <h4 className="fw-bold mb-4">Các khoản thanh toán</h4>

      {loading ? (
        <p>Đang tải...</p>
      ) : payouts.length === 0 ? (
        <div className="alert alert-info">Không có khoản thanh toán nào.</div>
      ) : (
        <div className="scroll-shadow">
          {payouts.map((payout) => (
            <div
              key={payout.payoutID}
              className="mb-3"
              onClick={() => setSelectedPayout(payout)}
              style={{ cursor: "pointer" }}
            >
              <div className="card h-100 shadow-sm border-success">
                <div className="card-body d-flex gap-3 p-3">
                  <FaMoneyCheckAlt className="fs-3 text-success mt-2" />
                  <div>
                    <h5 className="mb-1">{payout.jobName}</h5>
                    <p className="mb-1 small">
                      Ngày thanh toán:{" "}
                      {payout.payoutDate === "0001-01-01T00:00:00"
                        ? "Chưa xác định"
                        : format(new Date(payout.payoutDate), "dd/MM/yyyy HH:mm")}
                    </p>
                    <p className="mb-1 fw-semibold text-success">
                      Số tiền: {payout.amount.toLocaleString()}đ
                    </p>
                    <span className="badge bg-success">
                      {statusMap[payout.status] || "Không xác định"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Trước
          </button>

          <div className="d-flex align-items-center gap-1">
            <input
              type="number"
              className="form-control text-center"
              value={currentPage}
              min={1}
              max={totalPages}
              style={{ width: "60px" }}
              onChange={(e) => {
                const val = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                setCurrentPage(val);
              }}
            />
            <span className="fw-semibold">/ {totalPages}</span>
          </div>

          <button
            className="btn btn-outline-primary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPayout && (
        <PayoutDetailModal
          payout={selectedPayout}
          onClose={() => setSelectedPayout(null)}
        />
      )}
    </div>
  );
};

export default HouseKeeperPayoutsPage;
