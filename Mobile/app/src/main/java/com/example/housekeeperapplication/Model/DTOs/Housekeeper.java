package com.example.housekeeperapplication.Model.DTOs;

public class Housekeeper {
    private int housekeeperID;
    private int accountID;
    private String name;
    private int gender;
    private String email;
    private String phone;
    private int workType;
    private String localProfilePicture;
    private String googleProfilePicture;
    private String bankAccountNumber;
    private String introduction;
    private int verifyID;
    private String address;
    private String frontPhoto;
    private String backPhoto;
    private String facePhoto;
    private double rating;

    public Housekeeper(int housekeeperID, int accountID, String name, int gender, String email, String phone, int workType, String localProfilePicture, String googleProfilePicture, String bankAccountNumber, String introduction, int verifyID, String address, String frontPhoto, String backPhoto, String facePhoto) {
        this.housekeeperID = housekeeperID;
        this.accountID = accountID;
        this.name = name;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.workType = workType;
        this.localProfilePicture = localProfilePicture;
        this.googleProfilePicture = googleProfilePicture;
        this.bankAccountNumber = bankAccountNumber;
        this.introduction = introduction;
        this.verifyID = verifyID;
        this.address = address;
        this.frontPhoto = frontPhoto;
        this.backPhoto = backPhoto;
        this.facePhoto = facePhoto;
    }

    public int getHousekeeperID() {
        return housekeeperID;
    }

    public void setHousekeeperID(int housekeeperID) {
        this.housekeeperID = housekeeperID;
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

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
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

    public int getVerifyID() {
        return verifyID;
    }

    public void setVerifyID(int verifyID) {
        this.verifyID = verifyID;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFrontPhoto() {
        return frontPhoto;
    }

    public void setFrontPhoto(String frontPhoto) {
        this.frontPhoto = frontPhoto;
    }

    public String getBackPhoto() {
        return backPhoto;
    }

    public void setBackPhoto(String backPhoto) {
        this.backPhoto = backPhoto;
    }

    public String getFacePhoto() {
        return facePhoto;
    }

    public void setFacePhoto(String facePhoto) {
        this.facePhoto = facePhoto;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
