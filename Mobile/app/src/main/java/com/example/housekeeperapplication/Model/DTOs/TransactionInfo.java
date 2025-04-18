package com.example.housekeeperapplication.Model.DTOs;

import java.util.Date;

public class TransactionInfo {
    private int transactionID;
    private int transactionType;
    private int walletID;

    private int Amount;
    private int Fee;

    private String Description;
    private String CreatedDate;
    private String UpdatedDate;
    private int Status;

    public TransactionInfo(int transactionID, int transactionType, int walletID, int amount, int fee, String description, String createdDate, String updatedDate, int status) {
        this.transactionID = transactionID;
        this.transactionType = transactionType;
        this.walletID = walletID;
        Amount = amount;
        Fee = fee;
        Description = description;
        CreatedDate = createdDate;
        UpdatedDate = updatedDate;
        Status = status;
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

    public int getAmount() {
        return Amount;
    }

    public void setAmount(int amount) {
        Amount = amount;
    }

    public int getFee() {
        return Fee;
    }

    public void setFee(int fee) {
        Fee = fee;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getCreatedDate() {
        return CreatedDate;
    }

    public void setCreatedDate(String createdDate) {
        CreatedDate = createdDate;
    }

    public String getUpdatedDate() {
        return UpdatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        UpdatedDate = updatedDate;
    }

    public int getStatus() {
        return Status;
    }

    public void setStatus(int status) {
        Status = status;
    }
}
