package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ChatListAdapter;
import com.example.housekeeperapplication.Adapter.HousekeeperAdapter;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.ChatMessage;
import com.example.housekeeperapplication.Model.DTOs.Chat;
import com.example.housekeeperapplication.Model.DTOs.ChatUserDTO;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatListMockActivity extends AppCompatActivity {

    private RecyclerView chatRcl;
    private EditText etSearch;

    private ChatListAdapter adapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.chat_list);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountID = prefs.getInt("accountID", -1);
        int roleID = prefs.getInt("roleID", 0);

        chatRcl = findViewById(R.id.recyclerChatList);
        etSearch = findViewById(R.id.etSearchUser);

        List<Integer> accIDs = new ArrayList<>();
        List<ChatUserDTO> chatL = new ArrayList<>();
        chatRcl.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ChatListAdapter(chatL, ChatListMockActivity.this);
        chatRcl.setAdapter(adapter);



        APIServices api = APIClient.getClient(ChatListMockActivity.this).create(APIServices.class);
        Call<List<Integer>> call = api.getChatUsersByUser(accountID);
        call.enqueue(new Callback<List<Integer>>() {
            @Override
            public void onResponse(Call<List<Integer>> call, Response<List<Integer>> response) {
                if(response.isSuccessful() && response.errorBody()==null){
                    List<Integer> list = response.body();
                    for (var acc : list
                         ) {
                        accIDs.add(acc);
                    }
                    if(!accIDs.isEmpty()){
                        for (var accT: accIDs
                        ) {
                            Call<Account> callA = api.getAccountById(accT);
                            callA.enqueue(new Callback<Account>() {
                                @Override
                                public void onResponse(Call<Account> call, Response<Account> response) {
                                    if (response.isSuccessful()){
                                        Account acc = response.body();
                                        ChatUserDTO u = new ChatUserDTO();
                                        u.setName(acc.getName().toString());
                                        u.setFromAccountID(accountID);
                                        u.setRoleID(acc.getRoleID());
                                        u.setToAccountID(acc.getAccountID());
                                        u.setGoogleProfilePicture(acc.getGoogleProfilePicture());
                                        u.setLocalProfilePicture(acc.getLocalProfilePicture());
                                        chatL.add(u);
                                        adapter.notifyDataSetChanged();
                                    }
                                }

                                @Override
                                public void onFailure(Call<Account> call, Throwable t) {
                                    Toast.makeText(ChatListMockActivity.this, "Không thể tải dữ liệu tài khoản!", Toast.LENGTH_SHORT).show();
                                }
                            });

                        }
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Integer>> call, Throwable t) {
                Toast.makeText(ChatListMockActivity.this, "Không thể tải dữ liệu chat!", Toast.LENGTH_SHORT).show();
            }
        });

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
}
