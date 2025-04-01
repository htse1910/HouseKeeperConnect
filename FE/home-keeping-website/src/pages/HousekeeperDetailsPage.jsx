import React from "react";
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileCard from "../components/ProfileCard";
import ContactInfo from "../components/ContactInfo";
import ProfileIntroduction from "../components/ProfileIntroduction";
import CertificatesAndDocuments from "../components/CertificatesAndDocuments";
import IDCardImages from "../components/IDCardImages";
import HouseKeeperSkillsCard from "../components/HouseKeeperSkillsCard";

const HousekeeperProfilePage = () => {
  return (
    <div className="container py-4">
      {/* Profile Header */}
      <ProfileCard />

      {/* Introduction */}
      <ProfileIntroduction />
      <IDCardImages />

      <div className="row mt-3">
        {/* Skills */}
        <div className="col-md-6 d-flex">
          <HouseKeeperSkillsCard />
        </div>

        {/* Work Schedule */}
        <div className="col-md-6 d-flex">
          <div className="card p-4 shadow-sm w-100 h-100">
            <h5 className="fw-bold">Lịch làm việc</h5>
            <ul className="list-unstyled">
              <li>Thứ 2 - Thứ 6 <span className="text-success ms-3">8:00 - 17:00</span></li>
              <li>Thứ 7 <span className="text-success ms-3">8:00 - 12:00</span></li>
              <li>Chủ nhật <span className="text-danger ms-3">Nghỉ</span></li>
            </ul>
          </div>
        </div>
      </div>


      <div className="row mt-3">
        {/* Contact Information */}
        <ContactInfo />

        {/* Certificates & Documents */}
        <CertificatesAndDocuments />

      </div>
    </div>
  );
};

export default HousekeeperProfilePage;
