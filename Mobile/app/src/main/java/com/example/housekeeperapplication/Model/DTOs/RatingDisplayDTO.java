package com.example.housekeeperapplication.Model.DTOs;

public class RatingDisplayDTO {
    private int ratingID;
    private int familyID;
    private int houseKeeperID;
    private String content;
    private int score;
    private String createAt;

    public int getRatingID() {
        return ratingID;
    }

    public void setRatingID(int ratingID) {
        this.ratingID = ratingID;
    }

    public int getFamilyID() {
        return familyID;
    }

    public void setFamilyID(int familyID) {
        this.familyID = familyID;
    }

    public int getHouseKeeperID() {
        return houseKeeperID;
    }

    public void setHouseKeeperID(int houseKeeperID) {
        this.houseKeeperID = houseKeeperID;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getCreateAt() {
        return createAt;
    }

    public void setCreateAt(String createAt) {
        this.createAt = createAt;
    }
}
