package com.example.housekeeperapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Adapter.JobAdapter;
import com.example.housekeeperapplication.Model.Job;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

public class HomeHousekeeperActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_home_housekeeper);
        RecyclerView recyclerJobs = findViewById(R.id.recyclerJobs);
        List<Job> jobs = new ArrayList<>();


        jobs.add(new Job("Dọn dẹp dịp lễ 30/4", "Gia đình Nguyễn Văn A", "TP.HCM", "75000", "Full-time"));
        jobs.add(new Job("Nấu ăn", "Gia đình Trần Văn B", "Hà Nội", "90000", "Part-time"));


        JobAdapter adapter = new JobAdapter(jobs, job -> {
            Intent intent = new Intent(HomeHousekeeperActivity.this, JobHousekeeperDetailActivity.class);
            intent.putExtra("jobName", job.getJobName());
            intent.putExtra("familyName", job.getFamilyName());
            intent.putExtra("location", job.getLocation());
            intent.putExtra("salary", job.getSalary());
            intent.putExtra("type", job.getType());
            startActivity(intent);
        });
        recyclerJobs.setLayoutManager(new LinearLayoutManager(this));
        recyclerJobs.setAdapter(adapter);


        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_home);
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                return true;
            } else if (itemId == R.id.nav_activity) {
                startActivity(new Intent(this, HousekeeperBookingActivity.class));
                return true;
            } else if (itemId == R.id.nav_notification) {
                startActivity(new Intent(this, NotificationActivity.class));
                return true; // Đang ở trang thông báo
            /*} else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_profile) {
                startActivity(new Intent(this, HousekeeperProfile.class));
                return true;
            }
            return false;
        });

    }
}