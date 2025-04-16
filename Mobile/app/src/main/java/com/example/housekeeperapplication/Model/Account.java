package com.example.housekeeperapplication.Model;

import androidx.annotation.Nullable;

import java.util.Date;

public class Account {
    private int accountID;
    private String name;
    private String address;
    private int roleID;
    @Nullable
    private String googleProfilePicture;
    @Nullable
    private String localProfilePicture;
    @Nullable
    private String introduction;
    private int gender;
    private String nickname;
    private String email;
    private String phone;

    private String token;
    public Account(){}

    public Account(int accountID, String name, String address, int roleID, @Nullable String googleProfilePicture, @Nullable String localProfilePicture, @Nullable String introduction, int gender, String nickname, String email, String phone, String token) {
        this.accountID = accountID;
        this.name = name;
        this.address = address;
        this.roleID = roleID;
        this.googleProfilePicture = googleProfilePicture;
        this.localProfilePicture = localProfilePicture;
        this.introduction = introduction;
        this.gender = gender;
        this.nickname = nickname;
        this.email = email;
        this.phone = phone;
        this.token = token;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }

    @Nullable
    public String getGoogleProfilePicture() {
        return googleProfilePicture;
    }

    public void setGoogleProfilePicture(@Nullable String googleProfilePicture) {
        this.googleProfilePicture = googleProfilePicture;
    }

    @Nullable
    public String getLocalProfilePicture() {
        return localProfilePicture;
    }

    public void setLocalProfilePicture(@Nullable String localProfilePicture) {
        this.localProfilePicture = localProfilePicture;
    }

    @Nullable
    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(@Nullable String introduction) {
        this.introduction = introduction;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
