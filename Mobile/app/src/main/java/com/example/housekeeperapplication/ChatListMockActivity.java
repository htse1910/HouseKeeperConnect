package com.example.housekeeperapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class ChatListMockActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.chat_list);

        Button sampleChat = findViewById(R.id.btnSampleChat);
        sampleChat.setOnClickListener(v -> {
            Intent intent = new Intent(ChatListMockActivity.this, ChatPageMockActivity.class);
            startActivity(intent);
        });
    }
}
