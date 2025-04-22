package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class JobDetailPageDTO {
    public int jobID;
    public int familyID;
    public String jobName;
    public int status;
    public int jobType;
    public String location;
    public int price;
    public String startDate;
    public String endDate;
    public String description;
    public boolean isOffered;
    public int housekeeperID;
    public int bookingID;
    public List<Integer> serviceIDs;
    public List<Integer> slotIDs;
    public List<Integer> dayofWeek;

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

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
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

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
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

    public int getHousekeeperID() {
        return housekeeperID;
    }

    public void setHousekeeperID(int housekeeperID) {
        this.housekeeperID = housekeeperID;
    }

    public int getBookingID() {
        return bookingID;
    }

    public void setBookingID(int bookingID) {
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
}
