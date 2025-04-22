package com.example.housekeeperapplication.Model.DTOs;

import com.example.housekeeperapplication.Model.Job;

public class JobDetailDTO {
    private int jobDetailID;
    private int jobID;
    private String location;
    private int price;
    private int pricePerHour;
    private String startDate;
    private String endDate;
    private String description;
    private boolean isOffered;
    private int housekeeperID;
    private Job job;
    // Nested housekeeper object
    private Housekeeper housekeeper;

    // Getters and setters
    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }
    public int getJobDetailID() {
        return jobDetailID;
    }

    public void setJobDetailID(int jobDetailID) {
        this.jobDetailID = jobDetailID;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getJobID() {
        return jobID;
    }

    public void setJobID(int jobID) {
        this.jobID = jobID;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(int pricePerHour) {
        this.pricePerHour = pricePerHour;
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

    public Housekeeper getHousekeeper() {
        return housekeeper;
    }

    public void setHousekeeper(Housekeeper housekeeper) {
        this.housekeeper = housekeeper;
    }
}
