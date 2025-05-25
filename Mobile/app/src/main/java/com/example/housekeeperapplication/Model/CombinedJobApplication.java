package com.example.housekeeperapplication.Model;

import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;

import java.util.ArrayList;
import java.util.List;

public class CombinedJobApplication {
    private ApplicationDisplayDTO application;
    private JobDetailForBookingDTO jobDetail;
    private List<String> serviceNames;

    public CombinedJobApplication(ApplicationDisplayDTO application, JobDetailForBookingDTO jobDetail) {
        this.application = application;
        this.jobDetail = jobDetail;
        this.serviceNames = new ArrayList<>();
    }

    public String getJobName() {
        return jobDetail.jobName;
    }

    public void setJobName(String jobName) {
        this.jobDetail.jobName = jobName;
    }
    public String getLocation() {
        return jobDetail.location;
    }

    public void setLocation(String location) {
        this.jobDetail.location = location;
    }
    public String getDescription() {
        return jobDetail.description;
    }

    public void setDescription(String description) {
        this.jobDetail.description = description;
    }

    public String getStartDate() {
        return jobDetail.startDate;
    }

    public void setStartDate(String startDate) {
        this.jobDetail.startDate = startDate;
    }

    public String getEndDate() {
        return jobDetail.endDate;
    }

    public void setEndDate(String endDate) {
        this.jobDetail.endDate = endDate;
    }
    public double getPrice() {
        return jobDetail.price;
    }

    public void setPrice(double price) {
        this.jobDetail.price = price;
    }

    public String getFamilyName() {
        return jobDetail.familyName;
    }

    public void setFamilyName(String familyName) {
        this.jobDetail.familyName = familyName;
    }
    public int getJobType() {
        return jobDetail.jobType;
    }

    public void setJobType(int jobType) {
        this.jobDetail.jobType = jobType;
    }
    public int getJobID() {

        return jobDetail.jobID;
    }

    public void setJobID(int jobID) {

        this.jobDetail.jobID = jobID;
    }

    public int getAplicationStatus() {
        return application != null ? application.getApplicationStatus() : 0;
    }
    public void setAplicationStatus(int jobType) {
        this.application.getApplicationStatus();
    }
    public int getJobStatus() {
        return application != null ? jobDetail.getStatus() : 0;
    }
    public void setJobStatus(int jobType) {
        this.jobDetail.getStatus();
    }
    public List<Integer> getServiceIDs() {
        return jobDetail.serviceIDs;
    }

    public void setServiceIDs(List<Integer> serviceIDs) {
        this.jobDetail.serviceIDs = serviceIDs;
    }

    public List<String> getServiceNames() {
        return serviceNames;
    }

    public void setServiceNames(List<String> serviceNames) {
        this.serviceNames = serviceNames;
    }

    public List<Integer> getSlotIDs() {
        return jobDetail.slotIDs;
    }

    public void setSlotIDs(List<Integer> slotIDs) {
        this.jobDetail.slotIDs = slotIDs;
    }

    public List<Integer> getDayofWeek() {
        return jobDetail.dayofWeek;
    }

    public void setDayofWeek(List<Integer> dayofWeek) {
        this.jobDetail.dayofWeek = dayofWeek;
    }

}
