package com.example.housekeeperapplication.profile;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.style.TabStopSpan;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ProfileOptionAdapter;
import com.example.housekeeperapplication.ChatListMockActivity;
import com.example.housekeeperapplication.FamilyJobListActivity;
import com.example.housekeeperapplication.HomeActivity;
import com.example.housekeeperapplication.HomeHousekeeperActivity;
import com.example.housekeeperapplication.HousekeeperBookingActivity;
import com.example.housekeeperapplication.HousekeeperJob;
import com.example.housekeeperapplication.HousekeeperSkillActivity;
import com.example.housekeeperapplication.IdentityVerificationActivity;
import com.example.housekeeperapplication.LoginActivity;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.NotificationActivity;
import com.example.housekeeperapplication.ProfileOption;
import com.example.housekeeperapplication.R;
import com.example.housekeeperapplication.WalletFamilyActivity;
import com.example.housekeeperapplication.WalletHousekeeperActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.squareup.picasso.Picasso;

import java.util.Arrays;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HousekeeperProfile extends AppCompatActivity {

    private TextView userNameTxt;
    private ImageView avatar;
    private Button logoutbtn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_housekeeper_profile);

        userNameTxt = findViewById(R.id.tvUserName);
        avatar = findViewById(R.id.ivProfile);
        logoutbtn = findViewById(R.id.btnLogout);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1); // -1 nếu chưa login
        int roleID = prefs.getInt("roleID", 0);

        APIServices api = APIClient.getClient(HousekeeperProfile.this).create(APIServices.class);
        Call<Account> call = api.getAccountById(accountId);
        call.enqueue(new Callback<Account>() {
            @Override
            public void onResponse(Call<Account> call, Response<Account> response) {
                if (response.isSuccessful() && response.body() != null){
                    Account acc = response.body();
                    String name = acc.getName();
                    String img ="";
                    String localImg = acc.getLocalProfilePicture();
                    String googleImg = acc.getGoogleProfilePicture();
                    if(localImg  != null && googleImg ==null){
                        img = localImg;
                    }else{
                        img = googleImg;
                    }
                    userNameTxt.setText(name);
                    Picasso.get().load(img).into(avatar);
                }
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                Log.d("HousekeeperInfo", "Error" +t.getMessage());
            }
        });

        ImageView ivEditProfile = findViewById(R.id.ivEditProfile);

        ivEditProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(HousekeeperProfile.this, EditHousekeeperProfile.class);
                startActivity(intent);
            }
        });


        logoutbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor editor = prefs.edit();
                editor.clear();
                editor.apply();
                Intent logInIntent = new Intent(HousekeeperProfile.this, LoginActivity.class);
                startActivity(logInIntent);
                finish();
                Toast.makeText(HousekeeperProfile.this,"Bạn đã đăng xuất",Toast.LENGTH_SHORT).show();
            }
        });

        RecyclerView recyclerView = findViewById(R.id.recyclerViewOptionsHK);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        List<ProfileOption> options = Arrays.asList(
                new ProfileOption("Ví", R.drawable.ic_wallet),
                new ProfileOption("Xác thực danh tính", R.drawable.ic_verify),
                new ProfileOption("Công việc của tôi", R.drawable.ic_job2),
                new ProfileOption("Danh sách kỹ năng", R.drawable.ic_skill),
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
                case "Công việc của tôi":
                    startActivity(new Intent(HousekeeperProfile.this, HousekeeperJob.class));
                    break;
                case "Danh sách kỹ năng":
                    startActivity(new Intent(HousekeeperProfile.this, HousekeeperSkillActivity.class));
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