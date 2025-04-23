package com.example.housekeeperapplication;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Adapter.ChatMessageAdapter;
import com.example.housekeeperapplication.Model.ChatMessage;
import java.util.ArrayList;
import java.util.List;

public class ChatPageMockActivity extends AppCompatActivity {

    private RecyclerView recyclerMessages;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.chat_page);

        recyclerMessages = findViewById(R.id.recyclerMessages);
        recyclerMessages.setLayoutManager(new LinearLayoutManager(this));

        List<ChatMessage> mockMessages = new ArrayList<>();
        mockMessages.add(new ChatMessage("Chào bạn!", "09:00", false));
        mockMessages.add(new ChatMessage("Chào bạn, tôi có thể giúp gì?", "09:01", true));
        mockMessages.add(new ChatMessage("Bạn có rảnh vào thứ bảy?", "09:02", false));
        mockMessages.add(new ChatMessage("Có, tôi sẵn sàng.", "09:03", true));

        ChatMessageAdapter adapter = new ChatMessageAdapter(mockMessages);
        recyclerMessages.setAdapter(adapter);
    }
}
