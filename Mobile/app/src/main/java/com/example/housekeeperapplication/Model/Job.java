package com.example.housekeeperapplication.Model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class Job {
    private int jobID;
    private int familyID;
    private String jobName;
    private int status;
    private int jobType;
    private int price;
    private String location;
    private String createdDate;
    private String updatedDate;
    private Family family;
    private JobDetail jobDetail;
    private String startDate;
    private String endDate;
    private String description;
    private List<Integer> slotIDs;
    private List<Integer> dayofWeek;
    private List<Integer> serviceIDs;
    private boolean isOffered;
    private Integer housekeeperID;

    public Job() {}

    public Job(JobDetail jobDetail, Family family, String updatedDate, String createdDate, int jobType, int status, String jobName, int familyID, int jobID) {
        this.jobDetail = jobDetail;
        this.family = family;
        this.updatedDate = updatedDate;
        this.createdDate = createdDate;
        this.jobType = jobType;
        this.status = status;
        this.jobName = jobName;
        this.familyID = familyID;
        this.jobID = jobID;
    }

    public Job(String jobName, String familyName, String location, String salary, String type) {
        this.jobName = jobName;
        this.location = location;

        try {
            this.price = Integer.parseInt(salary);
        } catch (NumberFormatException e) {
            this.price = 0;
        }

        // Tạo Family + Account giả
        this.family = new Family();
        Account acc = new Account();
        acc.setName(familyName);
        this.family.setAccount(acc);

        switch (type.toLowerCase()) {
            case "full-time": this.jobType = 1; break;
            case "part-time": this.jobType = 2; break;
            default: this.jobType = 0; break;
        }
    }
    public String getStartDate() { return startDate; }
    public String getEndDate() { return endDate; }
    public String getDescription() { return description; }
    public List<Integer> getSlotIDs() { return slotIDs; }
    public List<Integer> getDayofWeek() { return dayofWeek; }
    public List<Integer> getServiceIDs() { return serviceIDs; }
    public boolean isOffered() { return isOffered; }
    public Integer getHousekeeperID() { return housekeeperID; }

    public String getFamilyName() {
        return family != null && family.getAccount() != null ? family.getAccount().getName() : "";
    }

    public String getLocation() {
        return location != null ? location : (jobDetail != null ? jobDetail.getLocation() : "");
    }

    public String getSalary() {
        return price + " VND";
    }

    public String getType() {
        switch (jobType) {
            case 1: return "Full-time";
            case 2: return "Part-time";
            default: return "Khác";
        }
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getJobType() {
        return jobType;
    }

    public void setJobType(int jobType) {
        this.jobType = jobType;
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

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Family getFamily() {
        return family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public JobDetail getJobDetail() {
        return jobDetail;
    }

    public void setJobDetail(JobDetail jobDetail) {
        this.jobDetail = jobDetail;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}