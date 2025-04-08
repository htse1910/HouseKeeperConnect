package com.example.housekeeperapplication.Model;

import java.util.Date;

public class Notification {
    private int notificationsID;
    private int accountID;
    private String message;
    private boolean isRead;
    private String redirectUrl;
    private String createdDate;


    public Notification() {}

    public Notification(int notificationsID, int accountID, String message, boolean isRead, String redirectUrl, String createdDate) {
        this.notificationsID = notificationsID;
        this.accountID = accountID;
        this.message = message;
        this.isRead = isRead;
        this.redirectUrl = redirectUrl;
        this.createdDate = createdDate;
    }
    public Notification(String message, String createdDate) {
        this.message = message;
        this.createdDate = createdDate;
    }

    // Getters & Setters
    public int getNotificationsID() { return notificationsID; }
    public void setNotificationsID(int notificationsID) { this.notificationsID = notificationsID; }

    public int getAccountID() { return accountID; }
    public void setAccountID(int accountID) { this.accountID = accountID; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getRedirectUrl() { return redirectUrl; }
    public void setRedirectUrl(String redirectUrl) { this.redirectUrl = redirectUrl; }

    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
}

