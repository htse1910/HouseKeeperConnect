package com.example.housekeeperapplication.Model.DTOs;

import java.util.Date;

public class FeeDisplayDTO {
    private int feeID;
    private double percent;
    private String createdDate;
    private String updatedDate;

    public FeeDisplayDTO(int feeID, double percent, String createdDate, String updatedDate) {
        this.feeID = feeID;
        this.percent = percent;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public int getFeeID() {
        return feeID;
    }

    public void setFeeID(int feeID) {
        this.feeID = feeID;
    }

    public double getPercent() {
        return percent;
    }

    public void setPercent(double percent) {
        this.percent = percent;
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
}
