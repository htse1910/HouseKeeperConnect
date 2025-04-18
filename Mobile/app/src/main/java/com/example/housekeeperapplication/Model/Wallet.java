package com.example.housekeeperapplication.Model;

public class Wallet {
    private int walletID;
    private int accountID;
    private double balance;
    private double onHold;
    private String createdAt;
    private String updatedAt;
    private int status;

    public Wallet(int walletID, int accountID, double balance, double onHold, String createdAt, String updatedAt, int status) {
        this.walletID = walletID;
        this.accountID = accountID;
        this.balance = balance;
        this.onHold = onHold;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
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

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public double getOnHold() {
        return onHold;
    }

    public void setOnHold(double onHold) {
        this.onHold = onHold;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
