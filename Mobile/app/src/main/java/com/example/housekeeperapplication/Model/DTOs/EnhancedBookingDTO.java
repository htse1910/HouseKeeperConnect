package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class EnhancedBookingDTO {
    public int bookingID;
    public int jobID;
    public int status;
    public List<Integer> slotIDs;
    public List<Integer> dayofWeek;
    public List<Integer> serviceIDs;

    // Thông tin từ JobDetail
    public String jobName;
    public String location;
    public double price;
    public String startDate;
    public String endDate;
    public String description;

    // Thông tin gia đình
    public String familyName;

    // Thông tin account
    public String familyProfilePicture;
}
