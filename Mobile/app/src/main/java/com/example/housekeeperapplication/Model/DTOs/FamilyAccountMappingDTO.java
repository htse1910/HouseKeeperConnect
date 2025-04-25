package com.example.housekeeperapplication.Model.DTOs;

public class FamilyAccountMappingDTO {
    public int accountID;
    private int familyID;

    public FamilyAccountMappingDTO(int accountID, int familyID) {
        this.accountID = accountID;
        this.familyID = familyID;
    }

    public int getFamilyID() {
        return familyID;
    }

    public void setFamilyID(int familyID) {
        this.familyID = familyID;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }
}
