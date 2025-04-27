package com.example.housekeeperapplication.Model;

import com.example.housekeeperapplication.Model.DTOs.Chat;

public class ChatMessage {
    private String text;
    private String time;
    private boolean isSent;

    public ChatMessage(){}
    public ChatMessage(String text, String time, boolean isSent) {
        this.text = text;
        this.time = time;
        this.isSent = isSent;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isSent() {
        return isSent;
    }

    public void setSent(boolean sent) {
        isSent = sent;
    }
}
