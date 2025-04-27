package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.FamilyJobAdapter;
import com.example.housekeeperapplication.Model.DTOs.FamilyJobSummaryDTO;
import com.example.housekeeperapplication.R;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FamilyJobListActivity extends AppCompatActivity {

    private RecyclerView recyclerJobs;
    private FamilyJobAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_job_list);

        recyclerJobs = findViewById(R.id.recyclerFamilyJobs);
        recyclerJobs.setLayoutManager(new LinearLayoutManager(this));

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1); // -1 nếu chưa login
        int roleID = prefs.getInt("roleID", 0);

        if (accountId == -1) {
            Toast.makeText(this, "Không tìm thấy tài khoản người dùng", Toast.LENGTH_SHORT).show();
            return;
        }

        APIServices api = APIClient.getClient(this).create(APIServices.class);
        api.getJobsByAccountID(accountId, 1, 100).enqueue(new Callback<List<FamilyJobSummaryDTO>>() {
            @Override
            public void onResponse(Call<List<FamilyJobSummaryDTO>> call, Response<List<FamilyJobSummaryDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter = new FamilyJobAdapter(FamilyJobListActivity.this, response.body());
                    recyclerJobs.setAdapter(adapter);
                } else {
                    Toast.makeText(FamilyJobListActivity.this, "Không tải được công việc", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<FamilyJobSummaryDTO>> call, Throwable t) {
                Toast.makeText(FamilyJobListActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", t.getMessage());
            }
        });

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_activity); // Đánh dấu tab đang chọn
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
