package com.example.housekeeperapplication.Model.DTOs;

public class ChatReturnDTO {
    private int fromAccountID ;

    private int toAccountID;

    private String content;
    private String sendAt;

    public ChatReturnDTO() {
    }

    public ChatReturnDTO(int fromAccountID, int toAccountID, String content, String sendAt) {
        this.fromAccountID = fromAccountID;
        this.toAccountID = toAccountID;
        this.content = content;
        this.sendAt = sendAt;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSendAt() {
        return sendAt;
    }

    public void setSendAt(String sendAt) {
        this.sendAt = sendAt;
    }
}
