package com.example.housekeeperapplication.profile;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ProfileOptionAdapter;
import com.example.housekeeperapplication.HomeActivity;
import com.example.housekeeperapplication.IdentityVerificationActivity;
import com.example.housekeeperapplication.LoginActivity;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.NotificationActivity;
import com.example.housekeeperapplication.ProfileOption;
import com.example.housekeeperapplication.R;
import com.example.housekeeperapplication.WalletHousekeeperActivity;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.squareup.picasso.Picasso;

import java.util.Arrays;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FamilyProfile extends AppCompatActivity {
    private TextView userNameTxt;
    private Button logoutbtn;
    private ImageView avatar;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_family_profile);

        userNameTxt = findViewById(R.id.tvUserName);
        avatar = findViewById(R.id.ivProfile);


        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1); // -1 nếu chưa login

        RecyclerView recyclerView = findViewById(R.id.recyclerViewOptions);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        List<ProfileOption> options = Arrays.asList(
                new ProfileOption("Ví", R.drawable.ic_wallet),
                new ProfileOption("Thanh toán", R.drawable.ic_payment),
                new ProfileOption("Trung tâm hỗ trợ", R.drawable.ic_support),
                new ProfileOption("Chính sách & Quy định", R.drawable.ic_policy),
                new ProfileOption("Cài đặt", R.drawable.ic_settings)
        );

        APIServices api = APIClient.getClient(FamilyProfile.this).create(APIServices.class);
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
                Intent intent = new Intent(FamilyProfile.this, EditFamilyProfile.class);
                startActivity(intent);
            }
        });

        ProfileOptionAdapter adapter = new ProfileOptionAdapter(options, option -> {
            switch (option.getTitle()) {
                case "Ví":
                    startActivity(new Intent(FamilyProfile.this, WalletHousekeeperActivity.class));
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

        logoutbtn = findViewById(R.id.btnLogout);
        logoutbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences.Editor editor = prefs.edit();
                editor.clear();
                editor.apply();
                Intent logInIntent = new Intent(FamilyProfile.this, LoginActivity.class);
                startActivity(logInIntent);
                finish();
                Toast.makeText(FamilyProfile.this,"Bạn đã đăng xuất",Toast.LENGTH_SHORT).show();
            }
        });

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_profile);
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();

            if (itemId == R.id.nav_home) {
                startActivity(new Intent(this, HomeActivity.class));
                return true;
          /*  } else if (itemId == R.id.nav_activity) {
                startActivity(new Intent(this, ActivityActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_notification) {
                startActivity(new Intent(this, NotificationActivity.class));
                return true;
           /* } else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_profile) {
                return true; // Đang ở trang Profile
            }

            return false;
        });

    }
}