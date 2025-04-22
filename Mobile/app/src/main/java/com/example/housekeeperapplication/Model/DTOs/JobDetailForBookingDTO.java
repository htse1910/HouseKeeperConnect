package com.example.housekeeperapplication.Model.DTOs;

public class JobDetailForBookingDTO {
    public int jobID;
    public int familyID;
    public int status; // <-- add this field if not present!

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
