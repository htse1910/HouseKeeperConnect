package com.example.housekeeperapplication.profile;

import android.content.Intent;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Adapter.ProfileOptionAdapter;
import com.example.housekeeperapplication.HomeHousekeeperActivity;
import com.example.housekeeperapplication.IdentityVerificationActivity;
import com.example.housekeeperapplication.NotificationActivity;
import com.example.housekeeperapplication.ProfileOption;
import com.example.housekeeperapplication.R;
import com.example.housekeeperapplication.WalletHousekeeperActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.Arrays;
import java.util.List;

public class HousekeeperProfile extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_housekeeper_profile);

        RecyclerView recyclerView = findViewById(R.id.recyclerViewOptionsHK);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        List<ProfileOption> options = Arrays.asList(
                new ProfileOption("Ví", R.drawable.ic_wallet),
                new ProfileOption("Xác thực danh tính", R.drawable.ic_verify),
                new ProfileOption("Thanh toán", R.drawable.ic_payment),
                new ProfileOption("Trung tâm hỗ trợ", R.drawable.ic_support),
                new ProfileOption("Chính sách & Quy định", R.drawable.ic_policy),
                new ProfileOption("Cài đặt", R.drawable.ic_settings)
        );

        ProfileOptionAdapter adapter = new ProfileOptionAdapter(options, option -> {
            switch (option.getTitle()) {
                case "Ví":
                    startActivity(new Intent(HousekeeperProfile.this, WalletHousekeeperActivity.class));
                    break;
                case "Xác thực danh tính":
                    startActivity(new Intent(HousekeeperProfile.this, IdentityVerificationActivity.class));
                    break;
                case "Thanh toán":
                    // ...
                    break;
                case "Trung tâm hỗ trợ":
                    // ...
                    break;
                case "Chính sách & Quy định":
                    // ...
                    break;
                case "Cài đặt":
                    // ...
                    break;
            }
        });

        recyclerView.setAdapter(adapter);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_profile); // Đánh dấu tab đang chọn

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                startActivity(new Intent(this, HomeHousekeeperActivity.class));
                return true;
            /*} else if (itemId == R.id.nav_activity) {
                startActivity(new Intent(this, ActivityActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_notification) {
                startActivity(new Intent(this, NotificationActivity.class));
                return true; // Đang ở trang thông báo
            /*} else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_profile) {
                return true;
            }
            return false;
        });
    }
}