package com.example.housekeeperapplication.Model.DTOs;

public class HousekeeperSkillMappingDisplayDTO {
    private int housekeeperSkillMappingID;
    private int accountID;
    private int houseKeeperSkillID;

    public HousekeeperSkillMappingDisplayDTO(int housekeeperSkillMappingID, int accountID, int houseKeeperSkillID) {
        this.housekeeperSkillMappingID = housekeeperSkillMappingID;
        this.accountID = accountID;
        this.houseKeeperSkillID = houseKeeperSkillID;
    }

    public int getHousekeeperSkillMappingID() {
        return housekeeperSkillMappingID;
    }

    public void setHousekeeperSkillMappingID(int housekeeperSkillMappingID) {
        this.housekeeperSkillMappingID = housekeeperSkillMappingID;
    }

    public int getAccountID() {
        return accountID;
    }

    public void setAccountID(int accountID) {
        this.accountID = accountID;
    }

    public int getHouseKeeperSkillID() {
        return houseKeeperSkillID;
    }

    public void setHouseKeeperSkillID(int houseKeeperSkillID) {
        this.houseKeeperSkillID = houseKeeperSkillID;
    }
}
