package com.example.housekeeperapplication.Model;

public class WithdrawRequest {
    private int accountId;
    private double amount;

    public WithdrawRequest(int accountId, double amount) {
        this.accountId = accountId;
        this.amount = amount;
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
