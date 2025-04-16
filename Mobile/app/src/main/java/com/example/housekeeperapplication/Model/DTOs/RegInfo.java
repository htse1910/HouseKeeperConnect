package com.example.housekeeperapplication.Model.DTOs;

import android.net.Uri;

import androidx.annotation.Nullable;

import java.io.File;

public class RegInfo {
    private String name;

    private String email;

    private String password;

    private String bankAccountNumber;

    private String phone;

    private int RoleID;
    @Nullable
    private String introduction;

    private String address;

    private int gender;
    @Nullable
    private String nickname;

    public RegInfo(String name, String email, String password, String bankAccountNumber, String phone, int roleID, @Nullable String introduction, String address, int gender, @Nullable String nickname) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.bankAccountNumber = bankAccountNumber;
        this.phone = phone;
        RoleID = roleID;
        this.introduction = introduction;
        this.address = address;
        this.gender = gender;
        this.nickname = nickname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public int getRoleID() {
        return RoleID;
    }

    public void setRoleID(int roleID) {
        RoleID = roleID;
    }

    @Nullable
    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(@Nullable String introduction) {
        this.introduction = introduction;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }

    @Nullable
    public String getNickname() {
        return nickname;
    }

    public void setNickname(@Nullable String nickname) {
        this.nickname = nickname;
    }
}
