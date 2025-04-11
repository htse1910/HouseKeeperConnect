package com.example.housekeeperapplication.Model;

public class Account {
    private int accountID;
    private String fullName;
    private String email;
    private String phone;
    public Account(){}
    public Account(int accountID, String fullName, String email, String phone) {
        this.accountID = accountID;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
