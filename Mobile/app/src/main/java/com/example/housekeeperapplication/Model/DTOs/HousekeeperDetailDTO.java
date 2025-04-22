package com.example.housekeeperapplication.Model.DTOs;

public class HousekeeperDetailDTO {
    public int housekeeperID;
    public int accountID;
    public String name;
    public int gender;
    public String email;
    public String phone;
    public String workType;
    public String localProfilePicture;
    public String googleProfilePicture;
    public String bankAccountNumber;
    public String bankAccountName;
    public String introduction;
    public int verifyID;
    public String address;
    public String frontPhoto;
    public String backPhoto;
    public String facePhoto;

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

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getGoogleProfilePicture() {
        return googleProfilePicture;
    }

    public void setGoogleProfilePicture(String googleProfilePicture) {
        this.googleProfilePicture = googleProfilePicture;
    }

    public String getLocalProfilePicture() {
        return localProfilePicture;
    }

    public void setLocalProfilePicture(String localProfilePicture) {
        this.localProfilePicture = localProfilePicture;
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

    public int getVerifyID() {
        return verifyID;
    }

    public void setVerifyID(int verifyID) {
        this.verifyID = verifyID;
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
}
