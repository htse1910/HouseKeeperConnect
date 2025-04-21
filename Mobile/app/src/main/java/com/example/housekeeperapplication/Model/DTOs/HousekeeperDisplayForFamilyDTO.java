package com.example.housekeeperapplication.Model.DTOs;

import java.util.List;

public class HousekeeperDisplayForFamilyDTO {
    private int accountID;
    private String name;
    private String address;
    private String localProfilePicture;
    private String googleProfilePicture;
    private List<String> skills;
    private int gender;
    private String workType;
    private double salary;
    private double rating;
    private String introduction;

    // Getters & Setters
    public int getAccountID() { return accountID; }
    public void setAccountID(int accountID) { this.accountID = accountID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLocalProfilePicture() { return localProfilePicture; }
    public void setLocalProfilePicture(String localProfilePicture) { this.localProfilePicture = localProfilePicture; }

    public String getGoogleProfilePicture() { return googleProfilePicture; }
    public void setGoogleProfilePicture(String googleProfilePicture) { this.googleProfilePicture = googleProfilePicture; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public int getGender() { return gender; }
    public void setGender(int gender) { this.gender = gender; }

    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }

    public double getSalary() { return salary; }
    public void setSalary(double salary) { this.salary = salary; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getIntroduction() { return introduction; }
    public void setIntroduction(String introduction) { this.introduction = introduction; }
}
