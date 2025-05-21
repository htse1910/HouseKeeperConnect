package com.example.housekeeperapplication.Model;

import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;

public class CombinedJobApplication {
    private ApplicationDisplayDTO application;
    private JobDetailForBookingDTO jobDetail;

    public CombinedJobApplication(ApplicationDisplayDTO application, JobDetailForBookingDTO jobDetail) {
        this.application = application;
        this.jobDetail = jobDetail;
    }

    public String getJobName() {
        return jobDetail != null ? jobDetail.getJobName() : "";
    }

    public double getPrice() {
        return jobDetail != null ? jobDetail.getPrice() : 0;
    }

    public String getFamilyName() {
        return application != null ? application.getFamilyName() : "";
    }

    public String getStartDate() {
        return application != null ? application.getStartDate() : "";
    }

    public String getEndDate() {
        return application != null ? application.getEndDate() : "";
    }

    public int getAplicationStatus() {
        return application != null ? application.getStatus() : 0;
    }
    public int getJobStatus() {
        return application != null ? jobDetail.getStatus() : 0;
    }
}
