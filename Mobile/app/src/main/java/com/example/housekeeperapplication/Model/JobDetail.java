package com.example.housekeeperapplication.Model;

import com.google.gson.annotations.SerializedName;

import java.util.List;
import java.util.Locale;

public class JobDetail {
    private int jobDetailID;
    private int jobID;
    private String location;
    private double price;
    private double pricePerHour;
    private String startDate;
    private String endDate;
    private String description;
    private boolean isOffered;
    private Integer housekeeperID;
    private List<Integer> slotIDs;
    private List<Integer> dayofWeek;
    private List<Integer> serviceIDs;

    public JobDetail() {}

    public JobDetail(int jobDetailID, int jobID, String location, double price, double pricePerHour, String startDate, String endDate, String description, boolean isOffered, Integer housekeeperID, List<Integer> slotIDs, List<Integer> dayofWeek, List<Integer> serviceIDs) {
        this.jobDetailID = jobDetailID;
        this.jobID = jobID;
        this.location = location;
        this.price = price;
        this.pricePerHour = pricePerHour;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.isOffered = isOffered;
        this.housekeeperID = housekeeperID;
        this.slotIDs = slotIDs;
        this.dayofWeek = dayofWeek;
        this.serviceIDs = serviceIDs;
    }

    public String getPriceText() {
        return String.format(Locale.getDefault(), "%,.0f VND", price);
    }

    public int getJobDetailID() {
        return jobDetailID;
    }

    public void setJobDetailID(int jobDetailID) {
        this.jobDetailID = jobDetailID;
    }

    public int getJobID() {
        return jobID;
    }

    public void setJobID(int jobID) {
        this.jobID = jobID;
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

    public double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(double pricePerHour) {
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

    public Integer getHousekeeperID() {
        return housekeeperID;
    }

    public void setHousekeeperID(Integer housekeeperID) {
        this.housekeeperID = housekeeperID;
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

    public List<Integer> getServiceIDs() {
        return serviceIDs;
    }

    public void setServiceIDs(List<Integer> serviceIDs) {
        this.serviceIDs = serviceIDs;
    }
}
