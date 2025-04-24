package com.example.housekeeperapplication.Model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class Job {
    private int jobID;
    private int familyID;
    private String jobName;
    private String location;
    private double price;
    private String createdAt;
    private int status;
    private int jobType;

    public Job(int jobID, int familyID, String jobName, String location, double price,
               String createdAt, int status, int jobType) {
        this.jobID = jobID;
        this.familyID = familyID;
        this.jobName = jobName;
        this.location = location;
        this.price = price;
        this.createdAt = createdAt;
        this.status = status;
        this.jobType = jobType;
    }

    public int getJobID() {
        return jobID;
    }

    public void setJobID(int jobID) {
        this.jobID = jobID;
    }

    public int getJobType() {
        return jobType;
    }

    public void setJobType(int jobType) {
        this.jobType = jobType;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public int getFamilyID() {
        return familyID;
    }

    public void setFamilyID(int familyID) {
        this.familyID = familyID;
    }
}