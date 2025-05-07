package com.example.housekeeperapplication.Model.DTOs;

public class JobItem {
    private int jobId;
    private String jobName;
    private String familyName;
    private double salary;
    private String startDate;
    private String endDate;
    private int status;

    public JobItem(int jobId, String jobName, String familyName, double salary, String startDate, String endDate, int status) {
        this.jobId = jobId;
        this.jobName = jobName;
        this.familyName = familyName;
        this.salary = salary;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public int getJobId() {
        return jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
