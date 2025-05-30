package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
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
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FamilyJobListActivity extends AppCompatActivity {

    private RecyclerView recyclerJobs;
    private FamilyJobAdapter adapter;
    private TextView tvEmptyState;
    private ProgressBar progressBar;
    private ConstraintLayout mainContent;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_job_list);

        recyclerJobs = findViewById(R.id.recyclerFamilyJobs);
        recyclerJobs.setLayoutManager(new LinearLayoutManager(this));
        tvEmptyState = findViewById(R.id.tvEmptyState);
        progressBar = findViewById(R.id.progressBar);
        mainContent = findViewById(R.id.mainContent);
        showLoading();
        FloatingActionButton fabAddJob = findViewById(R.id.fabAddJob);
        fabAddJob.setOnClickListener(view -> {
            Intent intent = new Intent(FamilyJobListActivity.this, AddJobActivity.class);
            startActivity(intent);
        });

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
                hideLoading();
                if (response.isSuccessful()) {
                    List<FamilyJobSummaryDTO> jobs = response.body();
                    if (jobs != null && !jobs.isEmpty()) {
                        showJobList(jobs);
                    }
                } else {
                    showEmptyState("Bạn chưa đăng công việc");
                }
            }

            @Override
            public void onFailure(Call<List<FamilyJobSummaryDTO>> call, Throwable t) {
                showEmptyState("Lỗi kết nối: " + t.getMessage());
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
    private void showLoading() {
        progressBar.setVisibility(View.VISIBLE);
        mainContent.setVisibility(View.INVISIBLE);
    }

    private void hideLoading() {
        progressBar.setVisibility(View.GONE);
        mainContent.setVisibility(View.VISIBLE);
    }
    private void showJobList(List<FamilyJobSummaryDTO> jobs) {
        recyclerJobs.setVisibility(View.VISIBLE);
        tvEmptyState.setVisibility(View.GONE);

        adapter = new FamilyJobAdapter(this, jobs);
        recyclerJobs.setAdapter(adapter);
    }

    private void showEmptyState(String message) {
        recyclerJobs.setVisibility(View.GONE);
        tvEmptyState.setVisibility(View.VISIBLE);
        tvEmptyState.setText(message);
    }
}
