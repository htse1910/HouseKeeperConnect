package com.example.housekeeperapplication;

public class ProfileOption {
    private final String title;
    private final int iconResId;

    public ProfileOption(String title, int iconResId) {
        this.title = title;
        this.iconResId = iconResId;
    }

    public String getTitle() {
        return title;
    }

    public int getIconResId() {
        return iconResId;
    }
}

