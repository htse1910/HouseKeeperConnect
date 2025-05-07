package com.example.housekeeperapplication;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
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

    private Button testNotiBtn;

    private Runnable refreshNotificationTask;
    private Handler handler = new Handler();

    private static final int NOTIFICATION_PERMISSION_CODE = 1;
    private static final int REQUEST_CODE_PERMISSIONS = 101;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_notification);

        recyclerViewNotifications = findViewById(R.id.recyclerViewNotifications);
        recyclerViewNotifications.setLayoutManager(new LinearLayoutManager(this));

        testNotiBtn = findViewById(R.id.testNotiBtn);



        createNotificationChannel();

        testNotiBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendNotification("Thông báo", "Đây là tin nhắn test!");
            }
        });
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_CODE);
            }
        }

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountID = prefs.getInt("accountID", 0);
        int roleID = prefs.getInt("roleID", 0);
        int pageNumber = 1;
        int pageSize = 6;

        List<Notification> oList = new ArrayList<>();
        notificationAdapter = new NotificationAdapter(oList);
        APIServices api = APIClient.getClient(NotificationActivity.this).create(APIServices.class);

        refreshNotificationTask = new Runnable() {
            @Override
            public void run() {
                Call<List<Notification>> call = api.getNotisByUserID(accountID, pageNumber, pageSize);
                call.enqueue(new Callback<List<Notification>>() {
                    @Override
                    public void onResponse(Call<List<Notification>> call, Response<List<Notification>> response) {
                        if(response.isSuccessful() && response.body()!=null){
                            List<Notification> nList = response.body();

                            for (Notification nItem : nList) {
                                boolean exist = oList.stream()
                                        .anyMatch(oItem -> oItem.getMessage().equals(nItem.getMessage()) &&
                                                oItem.getCreatedDate().equals(nItem.getCreatedDate()));
                                if (!exist) {
                                    sendNotification("Thông báo", nItem.getMessage());
                                    var noti = new Notification();
                                    noti.setRead(nItem.isRead());
                                    noti.setNotificationsID(nItem.getNotificationsID());
                                    noti.setCreatedDate(nItem.getCreatedDate());
                                    noti.setMessage(nItem.getMessage());
                                    noti.setAccountID(nItem.getAccountID());
                                    noti.setRedirectUrl(nItem.getRedirectUrl());
                                    oList.add(noti);
                                }
                            }

                            notificationAdapter.notifyDataSetChanged();



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
                handler.postDelayed(this, 60000);
            }

        };
        handler.postDelayed(refreshNotificationTask, 60000);

        Call<List<Notification>> call = api.getNotisByUserID(accountID, pageNumber, pageSize);
        call.enqueue(new Callback<List<Notification>>() {
            @Override
            public void onResponse(Call<List<Notification>> call, Response<List<Notification>> response) {
                if(response.isSuccessful() && response.body()!=null){
                    List<Notification> list = response.body();
                    for (var item : list
                         ) {
                        var noti = new Notification();
                        noti.setRead(item.isRead());
                        noti.setNotificationsID(item.getNotificationsID());
                        noti.setCreatedDate(item.getCreatedDate());
                        noti.setMessage(item.getMessage());
                        noti.setAccountID(item.getAccountID());
                        noti.setRedirectUrl(item.getRedirectUrl());
                        oList.add(noti);
                    }
                    notificationAdapter.notifyDataSetChanged();
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

    public void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "My Channel";
            String description = "Channel for my app notifications";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("1", name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public void sendNotification(String title, String message) {
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "1")
                .setSmallIcon(R.drawable.ic_notification) // Replace with your icon
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setSound(soundUri);

        notificationManager.notify(1, builder.build());
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == NOTIFICATION_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "Permission granted to post notifications", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Permission denied to post notifications", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        finish();
    }
}