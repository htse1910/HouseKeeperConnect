package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class BookingDTO {
    private int bookingID;
    private int jobID;
    private JobDetailDTO jobDetail;
    private List<Integer> slotIDs;
    private List<Integer> dayofWeek;
    private List<Integer> serviceIDs;
    private int status;

    // Getters and setters

    public int getBookingID() {
        return bookingID;
    }

    public void setBookingID(int bookingID) {
        this.bookingID = bookingID;
    }

    public int getJobID() {
        return jobID;
    }

    public void setJobID(int jobID) {
        this.jobID = jobID;
    }

    public JobDetailDTO getJobDetail() {
        return jobDetail;
    }

    public void setJobDetail(JobDetailDTO jobDetail) {
        this.jobDetail = jobDetail;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
