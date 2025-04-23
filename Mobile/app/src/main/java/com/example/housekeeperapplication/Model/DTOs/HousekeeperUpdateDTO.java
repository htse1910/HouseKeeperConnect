package com.example.housekeeperapplication.Model.DTOs;

import okhttp3.MultipartBody;

public class HousekeeperUpdateDTO {
    private int accountID;
    private String name;
    private String email;
    private String phone;
    private int workType;
    private String bankAccountNumber;
    private String bankAccountName;
    private String introduction;
    private String address;
    private int gender;
    private String nickname;
    private MultipartBody.Part localProfilePicture;

    public HousekeeperUpdateDTO(int accountID, String name, String email, String phone, int workType, String bankAccountNumber, String bankAccountName, String introduction, String address, int gender, String nickname, MultipartBody.Part localProfilePicture) {
        this.accountID = accountID;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.workType = workType;
        this.bankAccountNumber = bankAccountNumber;
        this.bankAccountName = bankAccountName;
        this.introduction = introduction;
        this.address = address;
        this.gender = gender;
        this.nickname = nickname;
        this.localProfilePicture = localProfilePicture;
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

    public int getWorkType() {
        return workType;
    }

    public void setWorkType(int workType) {
        this.workType = workType;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankAccountName() {
        return bankAccountName;
    }

    public void setBankAccountName(String bankAccountName) {
        this.bankAccountName = bankAccountName;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
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

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public MultipartBody.Part getLocalProfilePicture() {
        return localProfilePicture;
    }

    public void setLocalProfilePicture(MultipartBody.Part localProfilePicture) {
        this.localProfilePicture = localProfilePicture;
    }
}
