package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.NotificationAdapter;
import com.example.housekeeperapplication.Model.Notification;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountID = prefs.getInt("accountID", 0);
        int pageNumber = 1;
        int pageSize = 5;
        APIServices api = APIClient.getClient(NotificationActivity.this).create(APIServices.class);
        Call<List<Notification>> call = api.getNotisByUserID(accountID, pageNumber, pageSize);
        call.enqueue(new Callback<List<Notification>>() {
            @Override
            public void onResponse(Call<List<Notification>> call, Response<List<Notification>> response) {
                List<Notification> list = response.body();
                if(response.isSuccessful() && response.body()!=null){
                    notificationAdapter = new NotificationAdapter(list);
                    recyclerViewNotifications.setAdapter(notificationAdapter);
                }

                if(response.body()==null){
                    Toast.makeText(NotificationActivity.this, "Không có thông báo nào!", Toast.LENGTH_SHORT).show();
                }

            }

            @Override
            public void onFailure(Call<List<Notification>> call, Throwable t) {
                Toast.makeText(NotificationActivity.this, "Khổng thể tải dữ liệu!", Toast.LENGTH_SHORT).show();
            }
        });
        // Tạo danh sách thông báo mẫu
        /*notificationList.add(new Notification("Bạn đã nộp đơn ứng tuyển cho công việc 2", "00:38:00 8/4/2025"));
        notificationList.add(new Notification("Đã có cập nhật mới về đơn ứng tuyển của bạn", "08:30:00 8/4/2025"));*/

        // Gán adapte

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_notification); // Đánh dấu tab đang chọn

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                startActivity(new Intent(this, HomeHousekeeperActivity.class));
                return true;
            } else if (itemId == R.id.nav_activity) {
                startActivity(new Intent(this, HousekeeperBookingActivity.class));
                return true;
            } else if (itemId == R.id.nav_notification) {
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