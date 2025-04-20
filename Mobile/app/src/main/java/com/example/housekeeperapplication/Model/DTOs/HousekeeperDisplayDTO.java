package com.example.housekeeperapplication.Model.DTOs;

public class HousekeeperDisplayDTO {
    private int housekeeperID;
    private int accountID;
    private String name;
    private String email;
    private String phone;
    private String frontPhoto;
    private String backPhoto;
    private String facePhoto;

    public String getFrontPhoto() {
        return frontPhoto;
    }

    public void setFrontPhoto(String frontPhoto) {
        this.frontPhoto = frontPhoto;
    }

    public String getFacePhoto() {
        return facePhoto;
    }

    public void setFacePhoto(String facePhoto) {
        this.facePhoto = facePhoto;
    }

    public String getBackPhoto() {
        return backPhoto;
    }

    public void setBackPhoto(String backPhoto) {
        this.backPhoto = backPhoto;
    }
}
