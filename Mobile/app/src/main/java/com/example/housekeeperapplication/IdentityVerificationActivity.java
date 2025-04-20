package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayDTO;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class IdentityVerificationActivity extends AppCompatActivity {

    private ImageView imgFront, imgBack, imgPortrait;
    private Button btnUpdate;
    private APIServices apiServices;
    private int accountId; // Lấy từ SharedPreferences hoặc Intent

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_identity_verification);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1); // -1 nếu chưa login


        // Khởi tạo view
        imgFront = findViewById(R.id.imgFront);
        imgBack = findViewById(R.id.imgBack);
        imgPortrait = findViewById(R.id.imgPortrait);
        btnUpdate = findViewById(R.id.btnUpdate);

        // Khởi tạo API
        apiServices = APIClient.getClient(IdentityVerificationActivity.this).create(APIServices.class);



        if (accountId != -1) {
            loadIdentityPhotos(accountId);
        } else {
            Toast.makeText(this, "Không tìm thấy tài khoản", Toast.LENGTH_SHORT).show();
        }

        // Nút cập nhật (chưa làm upload, chỉ thông báo)
        btnUpdate.setOnClickListener(v -> {
            Intent intent = new Intent(IdentityVerificationActivity.this, UploadIdentityActivity.class);
            startActivity(intent);
        });
    }

    private void loadIdentityPhotos(int accountId) {
        apiServices.getHousekeeperByAccountID(accountId).enqueue(new Callback<Housekeeper>() {
            @Override
            public void onResponse(Call<Housekeeper> call, Response<Housekeeper> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Housekeeper housekeeper = response.body();

                    Glide.with(IdentityVerificationActivity.this)
                            .load(housekeeper.getFrontPhoto())
                            .placeholder(R.drawable.bg_image_placeholder)
                            .into(imgFront);

                    Glide.with(IdentityVerificationActivity.this)
                            .load(housekeeper.getBackPhoto())
                            .placeholder(R.drawable.bg_image_placeholder)
                            .into(imgBack);

                    Glide.with(IdentityVerificationActivity.this)
                            .load(housekeeper.getFacePhoto())
                            .placeholder(R.drawable.bg_image_placeholder)
                            .into(imgPortrait);
                } else {
                    Toast.makeText(IdentityVerificationActivity.this, "Không thể tải dữ liệu", Toast.LENGTH_SHORT).show();
                    Log.e("Verification", "Error: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Housekeeper> call, Throwable t) {
                Toast.makeText(IdentityVerificationActivity.this, "Lỗi kết nối máy chủ", Toast.LENGTH_SHORT).show();
                Log.e("Verification", "Failure: ", t);
            }
        });
    }
}
