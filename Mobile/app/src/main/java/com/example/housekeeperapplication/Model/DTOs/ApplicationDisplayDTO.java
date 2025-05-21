package com.example.housekeeperapplication.Model.DTOs;

import java.util.Date;
import java.util.List;

public class ApplicationDisplayDTO {

    private int applicationID;
    private String localProfilePicture;
    private String googleProfilePicture;
    private String familyName;
    private int accountID;
    private int jobID;
    private int housekeeperID;
    private String startDate;
    private String endDate;
    private String nickname;
    private int status;
    private double rating;


    public int getApplicationID() {
        return applicationID;
    }

    public void setApplicationID(int applicationID) {
        this.applicationID = applicationID;
    }

    public int getJobID() {
        return jobID;
    }

    public void setJobID(int jobID) {
        this.jobID = jobID;
    }

    public int getHousekeeperID() {
        return housekeeperID;
    }

    public void setHousekeeperID(int housekeeperID) {
        this.housekeeperID = housekeeperID;
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

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getLocalProfilePicture() {
        return localProfilePicture;
    }

    public void setLocalProfilePicture(String localProfilePicture) {
        this.localProfilePicture = localProfilePicture;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public String getGoogleProfilePicture() {
        return googleProfilePicture;
    }

    public void setGoogleProfilePicture(String googleProfilePicture) {
        this.googleProfilePicture = googleProfilePicture;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
    public String getFamilyName() {
        return familyName;
    }
    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }
}
