package com.example.housekeeperapplication.Model.DTOs;

import java.util.Date;
import java.util.List;

public class ApplicationDisplayDTO {

    private int ApplicationID;
    private int JobID;
    private int HousekeeperID;
    private String StartDate;
    private String EndDate;
    private String Nickname;
    private int Status;

    public int getApplicationID() {
        return ApplicationID;
    }

    public void setApplicationID(int applicationID) {
        ApplicationID = applicationID;
    }

    public int getJobID() {
        return JobID;
    }

    public void setJobID(int jobID) {
        JobID = jobID;
    }

    public int getHousekeeperID() {
        return HousekeeperID;
    }

    public void setHousekeeperID(int housekeeperID) {
        HousekeeperID = housekeeperID;
    }

    public String getStartDate() {
        return StartDate;
    }

    public void setStartDate(String startDate) {
        StartDate = startDate;
    }

    public String getEndDate() {
        return EndDate;
    }

    public void setEndDate(String endDate) {
        EndDate = endDate;
    }

    public String getNickname() {
        return Nickname;
    }

    public void setNickname(String nickname) {
        Nickname = nickname;
    }

    public int getStatus() {
        return Status;
    }

    public void setStatus(int status) {
        Status = status;
    }
}
