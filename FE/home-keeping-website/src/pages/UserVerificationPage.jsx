import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaFilter } from "react-icons/fa";
import "../assets/styles/Dashboard.css";

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

const UserVerificationPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [housekeepers, setHousekeepers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

        axios.get("http://localhost:5280/api/Housekeepers")
            .then((response) => {
                setHousekeepers(response.data);
            })
            .catch((err) => {
                console.error("Error fetching housekeepers:", err);
                setError("Failed to load housekeepers.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isDemo]);

    const handleApprove = (id) => {
        setHousekeepers((prev) =>
            prev.map((hk) => (hk.id === id ? { ...hk, status: "Approved" } : hk))
        );
        setSelectedHousekeeper(null);
    };

    const handleReject = (id) => {
        setHousekeepers((prev) =>
            prev.map((hk) => (hk.id === id ? { ...hk, status: "Rejected" } : hk))
        );
        setSelectedHousekeeper(null);
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
    const filteredHousekeepers = housekeepers.filter(hk => {
        return (
            hk.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterStatus === "All" || hk.status === filterStatus)
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

    if (loading) {
        return (
            <div className="dashboard-container">
                <span className="icon-loading"></span>
                <p>{t("loading_data")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <p className="error">❌ {error}</p>
                <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                    {t("view_demo")}
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>Housekeeper Management {isDemo ? "(Demo Mode)" : ""}</h1>

            {/* Ô tìm kiếm */}
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="housekeeper-search"
            />

            <table className="housekeeper-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
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
                            <td>
                                <span className={`status-${hk.status.toLowerCase()}`}>
                                    {hk.status}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="view-cccd-btn"
                                    onClick={() => handleViewCCCD(hk)}
                                >
                                    View CCCD
                                </button>
                            </td>
                            <td>
                                {hk.status === "Pending" && (
                                    <>
                                        <button className="housekeeper-btn housekeeper-btn-approve" onClick={() => handleApprove(hk.id)}>
                                            Approve
                                        </button>
                                        <button className="housekeeper-btn housekeeper-btn-reject" onClick={() => handleReject(hk.id)}>
                                            Reject
                                        </button>
                                    </>
                                )}
                                {hk.status === "Approved" && (
                                    <button className="housekeeper-btn housekeeper-btn-reject" onClick={() => handleReject(hk.id)}>
                                        Reject
                                    </button>
                                )}
                                {hk.status === "Rejected" && (
                                    <button className="housekeeper-btn housekeeper-btn-approve" onClick={() => handleApprove(hk.id)}>
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
                        <div className="cccd-images">
                            <div>
                                <p>Front</p>
                                <img src={selectedHousekeeper.cccdFront || ""} alt="CCCD Front" className="cccd-image" />
                            </div>
                            <div>
                                <p>Back</p>
                                <img src={selectedHousekeeper.cccdBack || ""} alt="CCCD Back" className="cccd-image" />
                            </div>
                            <div>
                                <p>With User</p>
                                <img src={selectedHousekeeper.cccdWithUser || ""} alt="CCCD With User" className="cccd-image" />
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
        </div>
    );
};

export default UserVerificationPage;
