package com.example.housekeeperapplication.Model.DTOs;

import androidx.annotation.Nullable;

public class ChatUserDTO {
    private int fromAccountID;
    private int toAccountID;
    private String name;
    private int roleID;
    @Nullable
    private String googleProfilePicture;
    @Nullable
    private String localProfilePicture;

    public ChatUserDTO(){}

    public ChatUserDTO(int fromAccountID, int toAccountID, String name, int roleID, @Nullable String googleProfilePicture, @Nullable String localProfilePicture) {
        this.fromAccountID = fromAccountID;
        this.toAccountID = toAccountID;
        this.name = name;
        this.roleID = roleID;
        this.googleProfilePicture = googleProfilePicture;
        this.localProfilePicture = localProfilePicture;
    }

    public int getFromAccountID() {
        return fromAccountID;
    }

    public void setFromAccountID(int fromAccountID) {
        this.fromAccountID = fromAccountID;
    }

    public int getToAccountID() {
        return toAccountID;
    }

    public void setToAccountID(int toAccountID) {
        this.toAccountID = toAccountID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRoleID() {
        return roleID;
    }

    public void setRoleID(int roleID) {
        this.roleID = roleID;
    }

    @Nullable
    public String getGoogleProfilePicture() {
        return googleProfilePicture;
    }

    public void setGoogleProfilePicture(@Nullable String googleProfilePicture) {
        this.googleProfilePicture = googleProfilePicture;
    }

    @Nullable
    public String getLocalProfilePicture() {
        return localProfilePicture;
    }

    public void setLocalProfilePicture(@Nullable String localProfilePicture) {
        this.localProfilePicture = localProfilePicture;
    }
}
