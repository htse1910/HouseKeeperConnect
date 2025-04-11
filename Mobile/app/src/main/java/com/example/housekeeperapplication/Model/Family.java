package com.example.housekeeperapplication.Model;

import com.google.gson.annotations.SerializedName;

public class Family {
    private int familyID;
    private Integer jobListed;
    private Integer totalApplicant;
    private int accountID;
    private Account account;
    public Family() {}
    public Family(int familyID, Integer jobListed, Integer totalApplicant, int accountID, Account account) {
        this.familyID = familyID;
        this.jobListed = jobListed;
        this.totalApplicant = totalApplicant;
        this.accountID = accountID;
        this.account = account;
    }
    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }


    public int getFamilyID() {
        return familyID;
    }

    public void setFamilyID(int familyID) {
        this.familyID = familyID;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public Integer getTotalApplicant() {
        return totalApplicant;
    }

    public void setTotalApplicant(Integer totalApplicant) {
        this.totalApplicant = totalApplicant;
    }

    public Integer getJobListed() {
        return jobListed;
    }

    public void setJobListed(Integer jobListed) {
        this.jobListed = jobListed;
    }
}
