package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class JobDetailForBookingDTO {
    public int jobID;
    public int familyID;
    public int status; // <-- add this field if not present!
    private String familyName;
    private String jobName;
    private int jobType;
    private String location;
    private double price;
    private String startDate;
    private String endDate;
    private String description;
    private boolean isOffered;
    private Integer housekeeperID;
    private Integer bookingID;
    private List<Integer> serviceIDs;
    private List<Integer> slotIDs;
    private List<Integer> dayofWeek;

    public JobDetailForBookingDTO(int jobID, int familyID, int status, String jobName, int jobType, String location, double price, String startDate, String endDate, String description, boolean isOffered, Integer housekeeperID, Integer bookingID, List<Integer> serviceIDs, List<Integer> slotIDs, List<Integer> dayofWeek) {
        this.jobID = jobID;
        this.familyID = familyID;
        this.status = status;
        this.jobName = jobName;
        this.jobType = jobType;
        this.location = location;
        this.price = price;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.isOffered = isOffered;
        this.housekeeperID = housekeeperID;
        this.bookingID = bookingID;
        this.serviceIDs = serviceIDs;
        this.slotIDs = slotIDs;
        this.dayofWeek = dayofWeek;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public int getJobType() {
        return jobType;
    }

    public void setJobType(int jobType) {
        this.jobType = jobType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isOffered() {
        return isOffered;
    }

    public void setOffered(boolean offered) {
        isOffered = offered;
    }

    public Integer getHousekeeperID() {
        return housekeeperID;
    }

    public void setHousekeeperID(Integer housekeeperID) {
        this.housekeeperID = housekeeperID;
    }

    public Integer getBookingID() {
        return bookingID;
    }

    public void setBookingID(Integer bookingID) {
        this.bookingID = bookingID;
    }

    public List<Integer> getServiceIDs() {
        return serviceIDs;
    }

    public void setServiceIDs(List<Integer> serviceIDs) {
        this.serviceIDs = serviceIDs;
    }

    public List<Integer> getSlotIDs() {
        return slotIDs;
    }

    public void setSlotIDs(List<Integer> slotIDs) {
        this.slotIDs = slotIDs;
    }

    public List<Integer> getDayofWeek() {
        return dayofWeek;
    }

    public void setDayofWeek(List<Integer> dayofWeek) {
        this.dayofWeek = dayofWeek;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public int getJobID() {
        return jobID;
    }

    public void setJobID(int jobID) {
        this.jobID = jobID;
    }

    public int getFamilyID() {
        return familyID;
    }

    public void setFamilyID(int familyID) {
        this.familyID = familyID;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
