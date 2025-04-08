import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaFilter } from "react-icons/fa";
import "../assets/styles/Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dữ liệu giả lập (150 bản ghi)
const generateFakeHousekeepers = () => {
    const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Bùi", "Đặng", "Đỗ", "Hồ"];
    const middleNames = ["Văn", "Thị", "Hữu", "Minh", "Quốc", "Thanh", "Đức", "Tấn", "Công", "Duy"];
    const lastNames = ["An", "Bình", "Châu", "Dương", "Hải", "Khang", "Linh", "Nam", "Phong", "Tú"];
    const statuses = ["Pending", "Approved", "Rejected"];

    const placeholderFront = "https://via.placeholder.com/200x100?text=CCCD+Front";
    const placeholderBack = "https://via.placeholder.com/200x100?text=CCCD+Back";
    const placeholderWithUser = "https://via.placeholder.com/200x100?text=CCCD+With+User";

    return Array.from({ length: 150 }, (_, i) => ({
        id: i + 1,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} 
               ${middleNames[Math.floor(Math.random() * middleNames.length)]} 
               ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        cccdFront: placeholderFront,
        cccdBack: placeholderBack,
        cccdWithUser: placeholderWithUser
    }));
};

const StaffUserVerificationPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [accountInfo, setAccountInfo] = useState(null);
    const [housekeepers, setHousekeepers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState("");

    const [emptyMessage, setEmptyMessage] = useState("");

    console.log("Housekeepers:", housekeepers);

    const shouldShowLoadingOrError = loading || error;

    useEffect(() => {
        const storedName = localStorage.getItem("userName") || t("staff");
        setUserName(storedName);
    }, []);

    // View CCCD
    const [selectedHousekeeper, setSelectedHousekeeper] = useState(null);

    // Filter and Search
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [showFilter, setShowFilter] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10; // Số bản ghi trên mỗi trang
    const MAX_VISIBLE_PAGES = 15;
    const [inputPage, setInputPage] = useState("");

    useEffect(() => {
        if (isDemo) {
            setHousekeepers(generateFakeHousekeepers());
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        const accountID = localStorage.getItem("accountID");

        if (!token) {
            setError(t("error_auth"));
            setLoading(false);
            return;
        }

        if (!accountID) {
            setError(t("error_account"));
            setLoading(false);
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        // Bước 1: Xác minh tài khoản staff
        axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
            .then((accountResponse) => {
                const account = accountResponse.data;
                if (!account || !account.accountID) throw new Error(t("error_auth"));
                if (account.roleID != "3") throw new Error(t("error_auth") + " Role authen");
                setAccountInfo(account);

                // Bước 2: Lấy danh sách housekeeper đang chờ
                return axios.get(`http://localhost:5280/api/HouseKeeper/ListHousekeeperPending`, {
                    params: { pageNumber: 1, pageSize: 1000 },
                    headers
                });
            })
            .then(async (res) => {
                const baseList = res.data;

                const isEmpty =
                    !baseList ||
                    (Array.isArray(baseList) && baseList.length === 0) ||
                    (typeof baseList === "string" && baseList.includes("Housekeeper Pending list is empty!"));

                if (isEmpty) {
                    setHousekeepers([]);
                    setEmptyMessage("Hiện giờ PCHWF platform chưa có Người giúp việc mới đăng ký.");
                    return;
                }

                // Bước 3: enrich dữ liệu từng housekeeper
                const enrichedList = await Promise.all(
                    baseList.map(async (hk) => {
                        try {
                            const detailRes = await axios.get(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByID`, {
                                params: { id: hk.housekeeperID },
                                headers
                            });
                            const detail = detailRes.data;

                            let accountData = {};
                            if (detail.accountID) {
                                try {
                                    const accountRes = await axios.get(`http://localhost:5280/api/Account/GetAccount`, {
                                        params: { id: detail.accountID },
                                        headers
                                    });
                                    accountData = accountRes.data;
                                } catch (err) {
                                    console.warn(`Không lấy được account của housekeeperID ${hk.housekeeperID}`);
                                }
                            }

                            return {
                                ...hk,
                                id: hk.housekeeperID,
                                accountID: hk.accountID,
                                verifyID: detail.verifyID,
                                status: "Pending",
                                cccdFront: hk.frontPhoto,
                                cccdBack: hk.backPhoto,
                                cccdWithUser: hk.facePhoto,
                                workType: detail.workType ?? null,

                                // Thêm từ account:
                                name: accountData.name || "",
                                nickname: accountData.nickname || "",
                                phone: accountData.phone || "",
                                gender: accountData.gender || null,
                                avatar: accountData.localProfilePicture || accountData.googleProfilePicture || ""
                            };
                        } catch (e) {
                            console.warn(`Không lấy được detail của housekeeper ID ${hk.housekeeperID}`);
                            return {
                                ...hk,
                                id: hk.housekeeperID,
                                status: String(hk.status ?? "Pending"),
                                cccdFront: hk.frontPhoto,
                                cccdBack: hk.backPhoto,
                                cccdWithUser: hk.facePhoto
                            };
                        }
                    })
                );

                setHousekeepers(enrichedList);
            })
            .catch((err) => {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError(t("error_loading"));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isDemo]);

    const processVerification = async (verifyID, action = "Approve") => {
        const token = localStorage.getItem("authToken");
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        try {
            // B1: Tạo task
            const createRes = await axios.post(
                `http://localhost:5280/api/VerificationTasks/Create`,
                null,
                {
                    params: { verifyID },
                    headers,
                }
            );

            // B2: Gửi hành động
            const endpoint =
                action === "Approve"
                    ? "Approve"
                    : action === "Reject"
                        ? "Reject"
                        : null;

            if (!endpoint) throw new Error("Invalid action type");

            await axios.post(
                `http://localhost:5280/api/VerificationTasks/${endpoint}`,
                null,
                {
                    params: { verifyID },
                    headers,
                }
            );

            return true;
        } catch (err) {
            console.error(`❌ Lỗi xử lý xác minh (${action}):`, err);
            throw err;
        }
    };

    const handleApprove = async (housekeeper) => {
        const token = localStorage.getItem("authToken");
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            // B1: Gọi CreateIDVerification
            await axios.post(`http://localhost:5280/api/IDVerifications/CreateIDVerification`, null, {
                params: {
                    housekeeperID: housekeeper.id
                },
                headers
            });

            // B2: Gọi VerificationTasks/Approve
            await axios.put(`/api/VerificationTasks/Approve`, null, {
                params: {
                    taskId: housekeeper.verifyID,
                    accountID: housekeeper.accountID,
                    notes: 'Approved by admin',
                },
                headers,
            });

            toast.success('✅ Duyệt hồ sơ thành công!');
            setHousekeepers((prev) =>
                prev.map((item) =>
                    item.id === housekeeper.id ? { ...item, status: "Approved" } : item
                )
            );
        } catch (err) {
            console.error(err);
            toast.error('❌ Lỗi khi duyệt hồ sơ.');
        }
    };

    const handleReject = async (housekeeper) => {
        const token = localStorage.getItem("authToken");
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            // B1: Gọi CreateIDVerification
            await axios.post(`http://localhost:5280/api/IDVerifications/CreateIDVerification`, null, {
                params: {
                    housekeeperID: housekeeper.id
                },
                headers
            });

            // B2: Gọi VerificationTasks/Reject
            await axios.put(`/api/VerificationTasks/Reject`, null, {
                params: {
                    taskId: housekeeper.verifyID,
                    accountID: housekeeper.accountID,
                    notes: 'Rejected by admin',
                },
                headers,
            });

            toast.success('✅ Đã từ chối hồ sơ!');
            setHousekeepers((prev) =>
                prev.map((item) =>
                    item.id === housekeeper.id ? { ...item, status: "Rejected" } : item
                )
            );
        } catch (err) {
            console.error(err);
            toast.error('❌ Lỗi khi từ chối hồ sơ.');
        }
    };

    const handleViewCCCD = (housekeeper) => {
        if (!housekeeper.cccdFront || !housekeeper.cccdBack || !housekeeper.cccdWithUser) {
            alert("This housekeeper does not have valid CCCD images.");
            return;
        }
        setSelectedHousekeeper(housekeeper);
    };

    const handleCloseModal = () => {
        setSelectedHousekeeper(null);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (status) => {
        setFilterStatus(status);
        setShowFilter(false);
        setCurrentPage(1);
    };

    // Lọc danh sách theo tên và trạng thái
    const filteredHousekeepers = housekeepers.filter((hk) => {
        const name = hk.name || "";
        const status = hk.status || "";
        return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterStatus === "All" || status === filterStatus)
        );
    });

    // Pagination Logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredHousekeepers.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredHousekeepers.length / recordsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPaginationRange = () => {
        if (totalPages <= MAX_VISIBLE_PAGES) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const middleStart = Math.max(currentPage - 2, 2);
        const middleEnd = Math.min(currentPage + 2, totalPages - 1);

        const pages = [1];

        if (middleStart > 2) {
            pages.push("...");
        }

        for (let i = middleStart; i <= middleEnd; i++) {
            pages.push(i);
        }

        if (middleEnd < totalPages - 1) {
            pages.push("...");
        }

        pages.push(totalPages);
        return pages;
    };

    const paginationRange = getPaginationRange();

    // Xử lý nhập số trang
    const handlePageInput = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) { // Chỉ cho phép số
            setInputPage(value);
        }
    };

    const handlePageSubmit = (event) => {
        event.preventDefault();
        const pageNumber = parseInt(inputPage, 10);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
        }
        setInputPage(""); // Xóa input sau khi nhập
    };

    if (shouldShowLoadingOrError) {
        return (
            <div className="dashboard-container">
                {loading && (
                    <>
                        <span className="icon-loading"></span>
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="error">❌ {error}</p>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                                {t("view_demo")}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Housekeeper Management {isDemo ? "(Demo Mode)" : ""}</h1>
            {emptyMessage && (
                <div className="user-verification-empty-message">
                    <p>{emptyMessage}</p>
                </div>
            )}

            {/* Ô tìm kiếm */}
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="housekeeper-search"
            />

            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Nickname</th>
                        <th>Work Type</th>
                        <th>Phone</th>
                        <th>Gender</th>
                        <th>
                            Status ({filterStatus} )
                            <span className="filter-icon" onClick={() => setShowFilter(!showFilter)}>
                                <FaFilter />
                            </span>
                            {showFilter && (
                                <div className="filter-dropdown">
                                    <button onClick={() => handleStatusChange("All")}>All</button>
                                    <button onClick={() => handleStatusChange("Pending")}>Pending</button>
                                    <button onClick={() => handleStatusChange("Approved")}>Approved</button>
                                    <button onClick={() => handleStatusChange("Rejected")}>Rejected</button>
                                </div>
                            )}
                        </th>
                        <th>CCCD</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((hk) => (
                        <tr key={hk.id}>
                            <td>{hk.id}</td>
                            <td>{hk.name}</td>
                            <td>{hk.nickname}</td>
                            <td>{hk.workType === 1 ? "Full-time" : hk.workType === 2 ? "Part-time" : "Unknown"}</td>
                            <td>{hk.phone}</td>
                            <td>{hk.gender === 1 ? "Nam" : hk.gender === 2 ? "Nữ" : "Khác"}</td>
                            <td>
                                <span className={`status-${String(hk.status || "").toLowerCase()}`}>
                                    {hk.status}
                                </span>
                            </td>
                            <td>
                                <button className="view-cccd-btn" onClick={() => handleViewCCCD(hk)}>
                                    View CCCD
                                </button>
                            </td>
                            <td>
                                {hk.status === "Pending" && (
                                    <>
                                        <button className="dashboard-btn dashboard-btn-approve" onClick={() => handleApprove(hk)}>
                                            Approve
                                        </button>
                                        <button className="dashboard-btn dashboard-btn-reject" onClick={() => handleReject(hk.id)}>
                                            Reject
                                        </button>
                                    </>
                                )}
                                {hk.status === "Approved" && (
                                    <button className="dashboard-btn dashboard-btn-reject" onClick={() => handleReject(hk.id)}>
                                        Reject
                                    </button>
                                )}
                                {hk.status === "Rejected" && (
                                    <button className="dashboard-btn dashboard-btn-approve" onClick={() => handleApprove(hk)}>
                                        Approve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="housekeeper-pagination">
                {totalPages > 15 && (
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                )}

                {paginationRange.map((page, index) =>
                    page === "..." ? (
                        <span key={index} className="dots">...</span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => paginate(page)}
                            className={currentPage === page ? "active-page" : ""}
                        >
                            {page}
                        </button>
                    )
                )}

                {totalPages > 15 && (
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                )}

                {/* Ô nhập số trang */}
                {totalPages > 15 && (
                    <form onSubmit={handlePageSubmit} className="pagination-input-form">
                        <input
                            type="text"
                            className="pagination-input"
                            value={inputPage}
                            onChange={handlePageInput}
                            placeholder="Go to..."
                        />
                        <button type="submit" className="pagination-go-btn">Go</button>
                    </form>
                )}
            </div>

            {/* Modal xem hình CCCD */}
            {selectedHousekeeper && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>CCCD Verification</h2>
                        <p>Housekeeper: {selectedHousekeeper.name}</p>
                        <div className="cccd-gallery">
                            <div className="cccd-item">
                                <p>Mặt trước</p>
                                <img src={selectedHousekeeper.cccdFront || ""} alt="CCCD Front" />
                            </div>
                            <div className="cccd-item">
                                <p>Mặt sau</p>
                                <img src={selectedHousekeeper.cccdBack || ""} alt="CCCD Back" />
                            </div>
                            <div className="cccd-item">
                                <p>Cầm trên tay</p>
                                <img src={selectedHousekeeper.cccdWithUser || ""} alt="CCCD With User" />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="approve-btn" onClick={() => handleApprove(selectedHousekeeper.id)}>
                                Approve
                            </button>
                            <button className="reject-btn" onClick={() => handleReject(selectedHousekeeper.id)}>
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000}
                hideProgressBar={false} newestOnTop={false}
                closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default StaffUserVerificationPage;
