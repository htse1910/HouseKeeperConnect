package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class BookingResponseDTO {
    public int bookingID;
    public int jobID;
    public String jobName;
    public double totalPrice;
    public double pricePerHour;
    public String description;
    public String location;
    public String detailLocation;
    public int housekeeperID;
    public int familyID;
    public String familyname;
    public String startDate;
    public String endDate;
    public int bookingStatus;
    public int jobStatus;
    public List<Integer> serviceIDs;
    public List<Integer> slotIDs;
    public List<Integer> dayofWeek;
}
