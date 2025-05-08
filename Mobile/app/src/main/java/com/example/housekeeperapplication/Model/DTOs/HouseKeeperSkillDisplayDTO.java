package com.example.housekeeperapplication.Model.DTOs;

public class HouseKeeperSkillDisplayDTO {
    private int houseKeeperSkillID;
    private String name;
    private String description;

    public HouseKeeperSkillDisplayDTO(int houseKeeperSkillID, String name, String description) {
        this.houseKeeperSkillID = houseKeeperSkillID;
        this.name = name;
        this.description = description;
    }

    public int getHouseKeeperSkillID() {
        return houseKeeperSkillID;
    }

    public void setHouseKeeperSkillID(int houseKeeperSkillID) {
        this.houseKeeperSkillID = houseKeeperSkillID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
