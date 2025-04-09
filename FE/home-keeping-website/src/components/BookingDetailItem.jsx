import React from "react";

const BookingDetailItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`small d-flex align-items-center ${className}`}>
    <Icon className="me-1" />
    <strong>{label}</strong> {value}
  </div>
);

export default BookingDetailItem;
