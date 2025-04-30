package com.example.housekeeperapplication.Model.DTOs;

import com.example.housekeeperapplication.Model.JobType;

import java.util.ArrayList;
import java.util.List;

public class JobCreateDTO {
    private int familyID;
    private String jobName;
    private JobType jobType;
    private String location;
    private double price;
    private String startDate;
    private String endDate;
    private String description;
    private boolean isOffered;
    private Integer housekeeperID;
    private List<Integer> serviceIDs;
    private List<Integer> slotIDs;
    private List<Integer> dayofWeek;
    public JobCreateDTO() {
        this.serviceIDs = new ArrayList<>();
        this.slotIDs = new ArrayList<>();
        this.dayofWeek = new ArrayList<>();
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

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }
    public int getJobTypeValue() {
        return jobType != null ? jobType.getValue() : 0;
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
