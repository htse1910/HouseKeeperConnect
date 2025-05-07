package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.HousekeeperAdapter;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayForFamilyDTO;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeActivity extends AppCompatActivity {

    private RecyclerView recyclerJobs;
    private HousekeeperAdapter adapter;
    private List<HousekeeperDisplayForFamilyDTO> housekeeperList = new ArrayList<>();
    private APIServices apiService;
    private TextView greetingTextView;
    private EditText etSearch;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);


        // 👋 Set greeting with actual name
        greetingTextView = findViewById(R.id.tvGreeting);
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        String name = prefs.getString("name", "");
        int roleID = prefs.getInt("roleID", 0);
        greetingTextView.setText("Chào " + name + " 👋");

        // Recycler setup
        recyclerJobs = findViewById(R.id.recyclerJobs);
        recyclerJobs.setLayoutManager(new LinearLayoutManager(this));

        //search
        etSearch = findViewById(R.id.etSearch);
        setupSearch();

        adapter = new HousekeeperAdapter(this, housekeeperList);
        recyclerJobs.setAdapter(adapter);

        apiService = APIClient.getClient(this).create(APIServices.class);
        loadHousekeepers();

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_home);
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
    private void setupSearch() {
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                adapter.filter(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void loadHousekeepers() {
        apiService.getHousekeepersForFamily(1, 100).enqueue(new Callback<List<HousekeeperDisplayForFamilyDTO>>() {
            @Override
            public void onResponse(Call<List<HousekeeperDisplayForFamilyDTO>> call, Response<List<HousekeeperDisplayForFamilyDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<HousekeeperDisplayForFamilyDTO> displayList = response.body();
                    List<HousekeeperDisplayForFamilyDTO> validHousekeepers = new ArrayList<>();

                    for (HousekeeperDisplayForFamilyDTO hk : displayList) {
                        apiService.getAccountById(hk.getAccountID()).enqueue(new Callback<Account>() {
                            @Override
                            public void onResponse(Call<Account> call, Response<Account> accountResponse) {
                                if (accountResponse.isSuccessful() && accountResponse.body() != null) {
                                    Account acc = accountResponse.body();
                                    if (acc.getRoleID() == 1) {
                                        hk.setName(acc.getName());
                                        validHousekeepers.add(hk);

                                        // Cập nhật adapter khi có dữ liệu mới
                                        if (adapter == null) {
                                            adapter = new HousekeeperAdapter(HomeActivity.this, validHousekeepers);
                                            recyclerJobs.setAdapter(adapter);
                                        } else {
                                            adapter.updateData(validHousekeepers);
                                        }
                                    }
                                }
                            }

                            @Override
                            public void onFailure(Call<Account> call, Throwable t) {
                                Log.e("API", "Failed to fetch account: " + t.getMessage());
                            }
                        });
                    }
                }
            }

            @Override
            public void onFailure(Call<List<HousekeeperDisplayForFamilyDTO>> call, Throwable t) {
                Toast.makeText(HomeActivity.this, "Failed to load housekeepers", Toast.LENGTH_SHORT).show();
            }
        });
    }

}
