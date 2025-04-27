package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ChatMessageAdapter;
import com.example.housekeeperapplication.Model.ChatMessage;
import com.example.housekeeperapplication.Model.DTOs.Chat;
import com.example.housekeeperapplication.Model.DTOs.ChatReturnDTO;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatPageMockActivity extends AppCompatActivity {

    private RecyclerView recyclerMessages;
    private EditText etMessage;
    private ImageButton sendBtn;
    private Handler handler = new Handler();
    private Runnable refreshMessagesTask;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.chat_page);

        etMessage = findViewById(R.id.etMessage);
        sendBtn = findViewById(R.id.btnSendMessage);
        recyclerMessages = findViewById(R.id.recyclerMessages);
        recyclerMessages.setLayoutManager(new LinearLayoutManager(this));

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int roleID = prefs.getInt("roleID", 0);

        Intent intent = getIntent();

        int fromAcc = intent.getIntExtra("fromAcc", -1);
        int toAcc = intent.getIntExtra("toAcc", -1);

        List<ChatMessage> messageL = new ArrayList<>();
        ChatMessageAdapter adapter = new ChatMessageAdapter(messageL);
        APIServices api = APIClient.getClient(ChatPageMockActivity.this).create(APIServices.class);

        refreshMessagesTask = new Runnable() {
            @Override
            public void run() {
                Call<List<Chat>> call = api.getChat(fromAcc, toAcc);
                call.enqueue(new Callback<List<Chat>>() {
                    @Override
                    public void onResponse(Call<List<Chat>> call, Response<List<Chat>> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            List<Chat> newMessages = response.body();
                            List<ChatMessage> newChatMessages = new ArrayList<>();

                            // Convert the new response to ChatMessage objects
                            for (Chat chat : newMessages) {
                                ChatMessage nChat = new ChatMessage();
                                nChat.setText(chat.getContent());
                                nChat.setTime(chat.getSendAt());
                                nChat.setSent(chat.getFromAccountID() == fromAcc);
                                newChatMessages.add(nChat);
                            }

                            // Merge with existing messages
                            for (ChatMessage newMessage : newChatMessages) {
                                boolean exists = false;
                                for (ChatMessage oldMessage : messageL) {
                                    if (oldMessage.getTime().equals(newMessage.getTime()) && oldMessage.getText().equals(newMessage.getText())) {
                                        exists = true;
                                        break;
                                    }
                                }
                                if (!exists) {
                                    messageL.add(newMessage); // Only add if it doesn't exist
                                }
                            }

                            // Sort messages by time after merging
                            Collections.sort(messageL, new Comparator<ChatMessage>() {
                                @Override
                                public int compare(ChatMessage m1, ChatMessage m2) {
                                    return m1.getTime().compareTo(m2.getTime());
                                }
                            });

                            // Notify the adapter of the data change
                            adapter.notifyDataSetChanged();
                            recyclerMessages.scrollToPosition(messageL.size() - 1); // Scroll to bottom
                        }
                    }

                    @Override
                    public void onFailure(Call<List<Chat>> call, Throwable t) {
                        Toast.makeText(ChatPageMockActivity.this, "Không thể tải dữ liệu chat! Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
                handler.postDelayed(this, 3000); // 3000 milliseconds = 3 seconds
            }

        };
        handler.postDelayed(refreshMessagesTask, 3000); // Start the first refresh

        Call<List<Chat>> call = api.getChat(fromAcc, toAcc);
        call.enqueue(new Callback<List<Chat>>() {
            @Override
            public void onResponse(Call<List<Chat>> call, Response<List<Chat>> response) {
                if(response.isSuccessful() && response.body()!=null){
                    List<Chat> cL = response.body();
                    for (var chat: cL
                    ) {
                        ChatMessage nChat = new ChatMessage();
                        if(chat.getFromAccountID()==fromAcc){
                            nChat.setText(chat.getContent());
                            nChat.setTime(chat.getSendAt());
                            nChat.setSent(true);
                        }else if(chat.getToAccountID()==fromAcc){
                            nChat.setText(chat.getContent());
                            nChat.setTime(chat.getSendAt());
                            nChat.setSent(false);
                        }
                        messageL.add(nChat);
                        Collections.sort(messageL, new Comparator<ChatMessage>() {
                            @Override
                            public int compare(ChatMessage m1, ChatMessage m2) {
                                return m1.getTime().compareTo(m2.getTime());
                            }
                        });
                        adapter.notifyDataSetChanged();
                        recyclerMessages.scrollToPosition(messageL.size() - 1);

                    }
                }
            }

            @Override
            public void onFailure(Call<List<Chat>> call, Throwable t) {
                Toast.makeText(ChatPageMockActivity.this, "Không thể tải dữ liệu chat! Lỗi: "+t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });



        sendBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String content = etMessage.getText().toString().trim();
                if(content.isEmpty()){
                    Toast.makeText(ChatPageMockActivity.this, "Xin hãy nhập nôị dung tin nhắn!", Toast.LENGTH_SHORT).show();
                    return;
                }
                Call<ChatReturnDTO> callN = api.sendChat(fromAcc, toAcc, content);
                etMessage.setText("");
                callN.enqueue(new Callback<ChatReturnDTO>() {
                    @Override
                    public void onResponse(Call<ChatReturnDTO> call, Response<ChatReturnDTO> response) {
                            if(response.isSuccessful()){

                            }
                    }

                    @Override
                    public void onFailure(Call<ChatReturnDTO> call, Throwable t) {
                        Toast.makeText(ChatPageMockActivity.this, "Lỗi khi gửi tin nhắn", Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });
/*
        mockMessages.add(new ChatMessage("Chào bạn!", "09:00", false));
        mockMessages.add(new ChatMessage("Chào bạn, tôi có thể giúp gì?", "09:01", true));
        mockMessages.add(new ChatMessage("Bạn có rảnh vào thứ bảy?", "09:02", false));
        mockMessages.add(new ChatMessage("Có, tôi sẵn sàng.", "09:03", true));
*/


        recyclerMessages.setAdapter(adapter);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_chat);

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                if(roleID==1){
                    startActivity(new Intent(this, HomeHousekeeperActivity.class));
                }else if(roleID==2){
                    startActivity(new Intent(this, HomeActivity.class));
                }
                return true;
            } else if (itemId == R.id.nav_activity) {
                if(roleID==1){
                    startActivity(new Intent(this, HousekeeperBookingActivity.class));
                }else if(roleID==2){
                    startActivity(new Intent(this, FamilyJobListActivity.class));
                }
                return true;
            } else if (itemId == R.id.nav_notification) {
                startActivity(new Intent(this, NotificationActivity.class));
                return true;
            } else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatListMockActivity.class));
                return true;
            } else if (itemId == R.id.nav_profile) {
                if(roleID==1){
                    startActivity(new Intent(this, HousekeeperProfile.class));
                }else if(roleID==2){
                    startActivity(new Intent(this, FamilyProfile.class));
                }
                return true;
            }
            return false;
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        handler.removeCallbacks(refreshMessagesTask); // Stop refreshing when the activity is destroyed
    }
}
