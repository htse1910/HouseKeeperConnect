package com.example.housekeeperapplication.Model.DTOs;

public class WalletInfo {
    private int accountID;
    private int balance;
    private int onHold;

    public WalletInfo(int accountID, int balance, int onHold) {
        this.accountID = accountID;
        this.balance = balance;
        this.onHold = onHold;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public int getBalance() {
        return balance;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }

    public int getOnHold() {
        return onHold;
    }

    public void setOnHold(int onHold) {
        this.onHold = onHold;
    }
}
