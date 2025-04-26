package com.example.housekeeperapplication.Model.DTOs;

public class FamilyAccountDetailDTO {
    private int accountID;
    private int familyID;
    public String name;
    private String email;
    private String phone;
    private String address;
    private int gender;
    private String localProfilePicture;
    private String googleProfilePicture;
    private String bankAccountNumber;
    private String introduction;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public int getFamilyID() {
        return familyID;
    }

    public void setFamilyID(int familyID) {
        this.familyID = familyID;
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

    public String getLocalProfilePicture() {
        return localProfilePicture;
    }

    public void setLocalProfilePicture(String localProfilePicture) {
        this.localProfilePicture = localProfilePicture;
    }

    public String getGoogleProfilePicture() {
        return googleProfilePicture;
    }

    public void setGoogleProfilePicture(String googleProfilePicture) {
        this.googleProfilePicture = googleProfilePicture;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }
}
