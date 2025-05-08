import React from "react";
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileCard from "../components/ProfileCard";
import ContactInfo from "../components/ContactInfo";
import ProfileIntroduction from "../components/ProfileIntroduction";
import CertificatesAndDocuments from "../components/CertificatesAndDocuments";
import IDCardImages from "../components/IDCardImages";
import HouseKeeperSkillsCard from "../components/HouseKeeperSkillsCard";
import HousekeeperReviewList from "../components/HousekeeperReviewList";
import ScrollToTopButton from "../components/ScrollToTopButton";
const HousekeeperProfilePage = () => {
  return (
    <div className="container py-4">
      <ScrollToTopButton />
      {/* Profile Header */}
      <ProfileCard />

      {/* Introduction */}
      <ProfileIntroduction />
      <IDCardImages />
      <div className="row mt-3">
        <div className="col-md-12">
          <HousekeeperReviewList />
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col-12">
          <HouseKeeperSkillsCard />
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
