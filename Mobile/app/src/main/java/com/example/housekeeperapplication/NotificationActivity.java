package com.example.housekeeperapplication;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Adapter.NotificationAdapter;
import com.example.housekeeperapplication.Model.Notification;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;

public class NotificationActivity extends AppCompatActivity {

    private RecyclerView recyclerViewNotifications;
    private NotificationAdapter notificationAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_notification);

        recyclerViewNotifications = findViewById(R.id.recyclerViewNotifications);
        recyclerViewNotifications.setLayoutManager(new LinearLayoutManager(this));

        // Tạo danh sách thông báo mẫu
        ArrayList<Notification> notificationList = new ArrayList<>();
        notificationList.add(new Notification("Bạn đã nộp đơn ứng tuyển cho công việc 2", "00:38:00 8/4/2025"));
        notificationList.add(new Notification("Đã có cập nhật mới về đơn ứng tuyển của bạn", "08:30:00 8/4/2025"));

        // Gán adapter
        notificationAdapter = new NotificationAdapter(notificationList);
        recyclerViewNotifications.setAdapter(notificationAdapter);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_notification); // Đánh dấu tab đang chọn

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                startActivity(new Intent(this, HomeActivity.class));
                return true;
            /*} else if (itemId == R.id.nav_activity) {
                startActivity(new Intent(this, ActivityActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_notification) {
                return true; // Đang ở trang thông báo
            /*} else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_profile) {
                startActivity(new Intent(this, FamilyProfile.class));
                return true;
            }
            return false;
        });

    }
}