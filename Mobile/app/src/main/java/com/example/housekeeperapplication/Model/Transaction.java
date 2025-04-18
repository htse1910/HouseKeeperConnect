package com.example.housekeeperapplication.Model;

public class Transaction {

    private int transactionID;
    private int transactionType;
    private int walletID;
    private int accountID;
    private double amount;
    private double fee;
    private String description;
    private String createdDate;
    private String updatedDate;
    private int status;

    public Transaction(int transactionID, int transactionType, int walletID, int accountID, double amount, double fee, String description, String createdDate, String updatedDate, int status) {
        this.transactionID = transactionID;
        this.transactionType = transactionType;
        this.walletID = walletID;
        this.accountID = accountID;
        this.amount = amount;
        this.fee = fee;
        this.description = description;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.status = status;
    }

    public int getTransactionID() {
        return transactionID;
    }

    public void setTransactionID(int transactionID) {
        this.transactionID = transactionID;
    }

    public int getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(int transactionType) {
        this.transactionType = transactionType;
    }

    public int getWalletID() {
        return walletID;
    }

    public void setWalletID(int walletID) {
        this.walletID = walletID;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getFee() {
        return fee;
    }

    public void setFee(double fee) {
        this.fee = fee;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
