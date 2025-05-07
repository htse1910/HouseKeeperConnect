package com.example.housekeeperapplication.Model.DTOs;

public class FamilyAccountMappingDTO {
    public int accountID;
    private int familyID;
    private String name;

    public FamilyAccountMappingDTO(int accountID, int familyID, String name) {
        this.accountID = accountID;
        this.familyID = familyID;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
