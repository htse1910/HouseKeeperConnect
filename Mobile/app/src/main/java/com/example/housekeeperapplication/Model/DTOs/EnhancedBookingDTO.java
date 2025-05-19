package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class EnhancedBookingDTO {
    public int bookingID;
    public int jobID;
    public int status;
    public List<Integer> slotIDs;
    public List<Integer> dayofWeek;
    public List<Integer> serviceIDs;
    public String jobName;
    public String location;
    public String detailLocation;
    public double price;
    public double pricePerHour;
    public String startDate;
    public String endDate;
    public String description;
    public String familyName;
    public String familyProfilePicture;
}
