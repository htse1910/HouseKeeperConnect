import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "../assets/styles/Search.css";
import axios from "axios";

const generateFakeHousekeepers = () => [
    {
        name: "Nguyễn Trường",
        address: "Hà Nội",
        phone: "0901234567",
        email: "a@gmail.com",
        gender: "Nam",
        salary: 150000,
        skills: ["Dọn dẹp", "Giặt ủi"],
        workType: "Full-time",
        rating: 4.5,
        avatar: "https://via.placeholder.com/80"
    },
    {
        name: "Lý Mai",
        address: "TP.HCM",
        phone: "0912345678",
        email: "b@gmail.com",
        gender: "Nữ",
        salary: 140000,
        skills: ["Nấu ăn"],
        workType: "Part-time",
        rating: 4.2,
        avatar: "https://via.placeholder.com/80"
    },
    {
        name: "Nguyễn Hưng",
        address: "Đà Nẵng",
        phone: "0923456789",
        email: "c@gmail.com",
        gender: "Nam",
        salary: 170000,
        skills: ["Giặt ủi"],
        workType: "Contract",
        rating: 4.0,
        avatar: "https://via.placeholder.com/80"
    }
];

const FamilyHousekeeperSearchPage = () => {
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedSalaryOrder, setSelectedSalaryOrder] = useState("");
    const [selectedWorkType, setSelectedWorkType] = useState("");
    const [housekeepers, setHousekeepers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    useEffect(() => {
        if (isDemo) {
            setHousekeepers(generateFakeHousekeepers());
            setLoading(false);
            return;
        }

        if (!authToken || !accountID) {
            setError("Lỗi xác thực hoặc thiếu tài khoản.");
            setLoading(false);
            return;
        }

        setLoading(true);
        axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
            .then((res) => {
                if (!res.data?.accountID) throw new Error("Không hợp lệ");
                return axios.get("http://localhost:5280/api/HouseKeeper/HousekeeperList", {
                    headers,
                    params: { pageNumber: 1, pageSize: 20 }
                });
            })
            .then((res) => {
                const housekeeperList = transformHousekeeperData(res.data?.data || []);
                console.log("Housekeepers sau khi transform:", housekeeperList);
                setHousekeepers(housekeeperList);
            })                    
            .catch((err) => {
                console.error("API Error:", err);
                setError("Không thể tải danh sách.");
            })
            .finally(() => setLoading(false));
    }, [isDemo]);

    const transformHousekeeperData = (rawList) => {
        return rawList.map(hk => ({
            name: hk.nickname,
            address: hk.address,
            phone: hk.phone,
            email: hk.email,
            gender: hk.gender === 1 ? "Nam" : "Nữ",
            workType: hk.workType === 1 ? "Full-time" : "Part-time", // nếu có workType = 3 thì thêm "Contract"
            salary: 150000, // nếu backend chưa có thì gán mặc định
            skills: ["Dọn dẹp", "Nấu ăn"], // giả định kỹ năng tạm thời
            rating: hk.rating,
            avatar: hk.localProfilePicture
        }));
    };

    const filteredHousekeepers = housekeepers;
        {/*}.filter(h =>
            h.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
            h.address?.toLowerCase().includes(location.toLowerCase()) &&
            (selectedSkill === "" || h.skills?.includes(selectedSkill)) &&
            (selectedGender === "" || h.gender === selectedGender) &&
            (selectedWorkType === "" || h.workType === selectedWorkType)
        )
        .sort((a, b) => {
            if (!selectedSalaryOrder) return 0;
            return selectedSalaryOrder === "asc"
                ? (a.salary || 0) - (b.salary || 0)
                : (b.salary || 0) - (a.salary || 0);
        });*/}

    return (
        <div className="search-page">
            <div className="search-page-header">
                <div className="search-page-panel">
                    <div className="search-page-box">
                        <div className="search-page-icon"><FaSearch /></div>
                        <input
                            className="search-page-input"
                            type="text"
                            placeholder="Nhập từ khóa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="search-page-filter-row">
                        <select className="search-page-select" value={location} onChange={e => setLocation(e.target.value)}>
                            <option value="">Địa điểm</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="TP.HCM">TP.HCM</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                        </select>
                        <select className="search-page-select" value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
                            <option value="">Kỹ năng</option>
                            <option value="Dọn dẹp">Dọn dẹp</option>
                            <option value="Giặt ủi">Giặt ủi</option>
                            <option value="Nấu ăn">Nấu ăn</option>
                        </select>
                        <select className="search-page-select" value={selectedGender} onChange={e => setSelectedGender(e.target.value)}>
                            <option value="">Giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                        <select className="search-page-select" value={selectedSalaryOrder} onChange={e => setSelectedSalaryOrder(e.target.value)}>
                            <option value="">Mức lương</option>
                            <option value="asc">Thấp đến cao</option>
                            <option value="desc">Cao đến thấp</option>
                        </select>
                        <select className="search-page-select" value={selectedWorkType} onChange={e => setSelectedWorkType(e.target.value)}>
                            <option value="">Hợp đồng</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                        <button className="search-page-btn">Tìm kiếm</button>
                    </div>
                </div>
            </div>

            {loading || error ? (
                <div className={loading ? "search-page-loading" : "search-page-error"}>
                    {loading && <>🔄 Đang tải dữ liệu...</>}
                    {error && <><div>❌ {error}</div>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                                Dùng thử chế độ demo
                            </button>
                        )}
                    </>}
                </div>
            ) : (
                <div className="search-page-result-container">
                    {filteredHousekeepers.length > 0 ? filteredHousekeepers.map((h, idx) => (
                        <div key={idx} className="search-page-card">
                            {h.avatar && (
                                <img
                                    src={h.avatar}
                                    alt={h.name}
                                    className="search-page-avatar-img"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            )}

                            <h5 className="search-page-title">
                                {h.name}
                                {h.workType && (
                                    <span className={`search-page-badge-type ${h.workType.toLowerCase().replace("-", "")}`}>
                                        {h.workType}
                                    </span>
                                )}
                            </h5>

                            <p className="search-page-info">
                                <span className="location-icon"></span>
                                {h.address}
                            </p>
                            <p className="search-page-info">
                                {Array.from({ length: 5 }, (_, index) => (
                                    <span key={index} className={`star-icon ${index < h.rating ? "filled" : ""}`}>
                                        ★
                                    </span>
                                ))}
                                {h.rating?.toFixed(1)}
                            </p>
                            <p className="search-page-info">
                                <span className="salary-icon">💰</span>
                                {h.salary?.toLocaleString()} VNĐ/giờ
                            </p>

                            <div className="search-page-skill-tags">
                                {h.skills?.map((skill, i) => (
                                    <span key={i} className="search-page-skill-tag">{skill}</span>
                                ))}
                            </div>

                            <div className="search-page-card-actions">
                                <button className="btn-primary">Mời làm việc</button>
                                <button className="search-page-detail-btn">Xem chi tiết</button>
                            </div>
                        </div>
                    )) : (
                        <div className="search-page-no-result">Không tìm thấy người giúp việc phù hợp.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FamilyHousekeeperSearchPage;
