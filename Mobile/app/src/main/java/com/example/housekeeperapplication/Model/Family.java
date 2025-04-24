package com.example.housekeeperapplication.Model;

import com.google.gson.annotations.SerializedName;

public class Family {
    private int familyID;
    private String name;
    private Integer jobListed;
    private Integer totalApplicant;
    private int accountID;
    private Account account;
    public Family() {}

    public Family(int familyID, String name, Integer jobListed, Integer totalApplicant, int accountID, Account account) {
        this.familyID = familyID;
        this.name = name;
        this.jobListed = jobListed;
        this.totalApplicant = totalApplicant;
        this.accountID = accountID;
        this.account = account;
    }

    public int getFamilyID() {
        return familyID;
    }

    public void setFamilyID(int familyID) {
        this.familyID = familyID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getJobListed() {
        return jobListed;
    }

    public void setJobListed(Integer jobListed) {
        this.jobListed = jobListed;
    }

    public Integer getTotalApplicant() {
        return totalApplicant;
    }

    public void setTotalApplicant(Integer totalApplicant) {
        this.totalApplicant = totalApplicant;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }
}
