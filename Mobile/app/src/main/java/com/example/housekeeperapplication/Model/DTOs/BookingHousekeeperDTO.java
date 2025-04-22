package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class BookingHousekeeperDTO {
    public int bookingID;
    public int jobID;
    public JobDetail jobDetail;
    public List<Integer> slotIDs;
    public List<Integer> dayofWeek;
    public List<Integer> serviceIDs;
    public int status;

    public static class JobDetail {
        public int jobDetailID;
        public int jobID;
        public String location;
        public int price;
        public int pricePerHour;
        public int feeID;
        public String startDate;
        public String endDate;
        public String description;
        public boolean isOffered;
        public int housekeeperID;
        public Housekeeper housekeeper;
    }

    public static class Housekeeper {
        public int housekeeperID;
        public int accountID;
        public Boolean isVerified;
        public int jobCompleted;
        public int jobsApplied;
        public int workType;
        public int numberOfRatings;
        public int verifyID;
    }
}
