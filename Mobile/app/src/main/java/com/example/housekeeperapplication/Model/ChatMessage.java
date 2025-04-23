package com.example.housekeeperapplication.Model;

public class ChatMessage {
    private final String text;
    private final String time;
    private final boolean isSent;

    public ChatMessage(String text, String time, boolean isSent) {
        this.text = text;
        this.time = time;
        this.isSent = isSent;
    }

    public String getText() { return text; }
    public String getTime() { return time; }
    public boolean isSent() { return isSent; }
}
