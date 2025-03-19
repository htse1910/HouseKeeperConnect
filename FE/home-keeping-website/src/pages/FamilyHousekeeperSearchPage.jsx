import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "../assets/styles/Search.css";

const FamilyHousekeeperSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("");
    const [housekeepers, setHousekeepers] = useState([
        { id: 1, name: "Nguyễn Thị A", location: "Hà Nội", experience: "3 năm", rating: 4.5 },
        { id: 2, name: "Trần Văn B", location: "TP.HCM", experience: "5 năm", rating: 4.8 },
        { id: 3, name: "Lê Thị C", location: "Đà Nẵng", experience: "2 năm", rating: 4.2 }
    ]);

    const filteredHousekeepers = housekeepers.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        h.location.toLowerCase().includes(location.toLowerCase())
    );

    return (
        <div className="search-page">
            <div className="search-header">
                <div className="search-box">
                    <span className="search-icon"><FaSearch /></span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Nhập tên người giúp việc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="search-filters">
                    <select className="search-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                        <option value="">Địa điểm</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP.HCM">TP.HCM</option>
                    </select>
                    <button className="search-btn">Tìm kiếm</button>
                </div>
            </div>

            <div className="result-container">
                {filteredHousekeepers.length > 0 ? (
                    filteredHousekeepers.map(h => (
                        <div key={h.id} className="result-card">
                            <h5 className="card-title">{h.name}</h5>
                            <p className="card-info">📍 {h.location}</p>
                            <p className="card-info">🛠 Kinh nghiệm: {h.experience}</p>
                            <p className="card-info">⭐ Đánh giá: {h.rating}</p>
                            <span className="badge">Người giúp việc</span>
                            <button className="detail-btn">Xem chi tiết</button>
                        </div>
                    ))
                ) : (
                    <p className="no-result">Không tìm thấy người giúp việc phù hợp.</p>
                )}
            </div>
        </div>
    );
};

export default FamilyHousekeeperSearchPage;
