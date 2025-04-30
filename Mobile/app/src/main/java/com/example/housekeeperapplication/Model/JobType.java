package com.example.housekeeperapplication.Model;

public enum JobType {
    FULL_TIME(1, "Toàn thời gian"),
    PART_TIME(2, "Bán thời gian");

    private final int value;
    private final String displayName;

    JobType(int value, String displayName) {
        this.value = value;
        this.displayName = displayName;
    }

    public int getValue() {
        return value;
    }

    public String getDisplayName() {
        return displayName;
    }

    // Phương thức tìm enum theo giá trị số
    public static JobType fromValue(int value) {
        for (JobType type : values()) {
            if (type.value == value) {
                return type;
            }
        }
        return FULL_TIME; // Giá trị mặc định
    }
}
