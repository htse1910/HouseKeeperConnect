package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Adapter.JobAdapter;
import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.Job;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeHousekeeperActivity extends AppCompatActivity {

    private RecyclerView recyclerJobs;
    private JobAdapter jobAdapter;
    private List<Job> jobList = new ArrayList<>();
    private APIServices apiService;
    private SharedPreferences sharedPreferences;
    private TextView tvGreeting;
    private EditText etSearch;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_home_housekeeper);

        // Initialize views
        recyclerJobs = findViewById(R.id.recyclerJobs);
        tvGreeting = findViewById(R.id.tvGreeting);
        //search job
        etSearch = findViewById(R.id.etSearch);
        setupSearch();
        // Get user info from SharedPreference
        sharedPreferences = getSharedPreferences("user_prefs", MODE_PRIVATE);
        String name = sharedPreferences.getString("name", "");
        int roleID = sharedPreferences.getInt("roleID", 0);
        tvGreeting.setText("Chào " + name + " 👋");

        // Initialize RecyclerView
        recyclerJobs.setLayoutManager(new LinearLayoutManager(this));
        jobAdapter = new JobAdapter(jobList, job -> {
            Intent intent = new Intent(this, JobHousekeeperDetailActivity.class);
            intent.putExtra("jobID", job.getJobID());
            startActivity(intent);
        }, HomeHousekeeperActivity.this);  // Pass context as third parameter
        recyclerJobs.setAdapter(jobAdapter);

        // Initialize API service
        apiService = APIClient.getClient(this).create(APIServices.class);

        // Load jobs and filter by status=3
        loadJobs(1, 10);
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_home); // Đánh dấu tab đang chọn
        // Setup bottom navigation
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
                jobAdapter.filter(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void loadJobs(int pageNumber, int pageSize) {
        Call<List<Job>> call = apiService.getVerifyJob(pageNumber, 50);

        call.enqueue(new Callback<List<Job>>() {
            @Override
            public void onResponse(Call<List<Job>> call, Response<List<Job>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Log.d("API_RESPONSE", "Total jobs received: " + response.body().size());
                    jobList.clear();
                    for (Job job : response.body()) {
                        if (job.getStatus() == 2) {
                            jobList.add(job);
                        }
                    }
                    jobAdapter = new JobAdapter(jobList, job -> {
                        Intent intent = new Intent(HomeHousekeeperActivity.this, JobHousekeeperDetailActivity.class);
                        intent.putExtra("jobID", job.getJobID());
                        startActivity(intent);
                    }, HomeHousekeeperActivity.this);

                    recyclerJobs.setAdapter(jobAdapter);

                    if (jobList.isEmpty()) {
                        Toast.makeText(HomeHousekeeperActivity.this,
                                "Không có công việc hoàn thành nào",
                                Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(HomeHousekeeperActivity.this,
                            "Lỗi khi tải công việc: " + response.message(),
                            Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Error code: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<List<Job>> call, Throwable t) {
                Toast.makeText(HomeHousekeeperActivity.this,
                        "Lỗi mạng: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
                Log.e("NETWORK_ERROR", t.getMessage(), t);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Refresh data when returning to this activity
        loadJobs(1, 10);
    }
}