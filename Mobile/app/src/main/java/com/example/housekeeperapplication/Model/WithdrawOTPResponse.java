package com.example.housekeeperapplication.Model;

import com.google.gson.annotations.SerializedName;

public class WithdrawOTPResponse {
    @SerializedName("withdrawID")
    private int withdrawID;

    @SerializedName("otpExpiredTime")
    private String otpExpiredTime;

    public int getWithdrawID() {
        return withdrawID;
    }

    public String getOtpExpiredTime() {
        return otpExpiredTime;
    }
}
