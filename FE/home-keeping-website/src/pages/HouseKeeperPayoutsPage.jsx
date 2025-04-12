import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { format } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import PayoutDetailModal from "../components/PayoutDetailModal";

const HouseKeeperPayoutsPage = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      const accountID = localStorage.getItem("accountID");
      const token = localStorage.getItem("authToken");

      if (!accountID || !token) {
        toast.error("Bạn chưa đăng nhập.");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5280/api/Payout/GetPayoutsByHK?accountID=${accountID}&pageNumber=1&pageSize=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const detailed = await Promise.all(
          res.data.map(async (payout) => {
            const familyRes = await axios.get(
              `http://localhost:5280/api/Families/GetFamilyByID?id=${payout.familyID}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const accountRes = await axios.get(
              `http://localhost:5280/api/Account/GetAccount?id=${familyRes.data.accountID}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            return {
              ...payout,
              familyName: accountRes.data.name,
              avatar: accountRes.data.localProfilePicture,
              phone: accountRes.data.phone,
              bank: accountRes.data.bankAccountNumber,
            };
          })
        );

        setPayouts(detailed);
      } catch (error) {
        toast.error("Không thể tải dữ liệu thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

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
                      {format(new Date(payout.payoutDate), "dd/MM/yyyy HH:mm")}
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
