package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayDTO;
import com.squareup.picasso.Picasso;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class IdentityVerificationActivity extends AppCompatActivity {

    private ImageView imgFront, imgBack, imgPortrait;
    private Button btnUpload, btnUpdate;
    private APIServices apiServices;
    private boolean hasFrontPhoto ;
    private boolean hasBackPhoto ;
    private boolean hasFacePhoto ;
    private int accountId; // Lấy từ SharedPreferences hoặc Intent
    private int verifyID;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_identity_verification);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1); // -1 nếu chưa login
        apiServices = APIClient.getClient(this).create(APIServices.class);

        // Khởi tạo view
        imgFront = findViewById(R.id.imgFront);
        imgBack = findViewById(R.id.imgBack);
        imgPortrait = findViewById(R.id.imgPortrait);
        btnUpload = findViewById(R.id.btnUpload);
        btnUpdate = findViewById(R.id.btnUpdate);

        hasFrontPhoto = false;
        hasBackPhoto = false;
        hasFacePhoto = false;

        if (accountId != -1) {
            apiServices.getHousekeeperByAccountID(accountId).enqueue(new Callback<Housekeeper>() {
                @Override
                public void onResponse(Call<Housekeeper> call, Response<Housekeeper> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        Housekeeper housekeeper = response.body();

                        String frontPhoto = housekeeper.getFrontPhoto();
                        String backPhoto = housekeeper.getBackPhoto();
                        String facePhoto = housekeeper.getFacePhoto();

                        btnUpdate.setEnabled(false);
                        btnUpdate.setVisibility(View.INVISIBLE);



                        if (frontPhoto!=null) {
                            Picasso.get().load(frontPhoto).placeholder(R.drawable.bg_image_placeholder).into(imgFront);
                            hasFrontPhoto = true;
                        }

                        if (backPhoto!=null) {
                            Picasso.get().load(backPhoto).placeholder(R.drawable.bg_image_placeholder).into(imgBack);
                            hasBackPhoto = true;
                        }

                        if (facePhoto!=null) {
                            Picasso.get().load(facePhoto).placeholder(R.drawable.bg_image_placeholder).into(imgPortrait);
                            hasFacePhoto = true;
                        }
                        if (hasFrontPhoto  && hasBackPhoto  && hasFacePhoto ) {
                            Toast.makeText(IdentityVerificationActivity.this, "Đã gửi xác minh giấy tờ rồi, chỉ có thể cập nhật lại", Toast.LENGTH_SHORT).show();
                            btnUpload.setEnabled(false);
                            btnUpload.setVisibility(View.INVISIBLE);
                            btnUpdate.setEnabled(true);
                            btnUpdate.setVisibility(View.VISIBLE);
                        }
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
        } else {
            Toast.makeText(this, "Không tìm thấy tài khoản", Toast.LENGTH_SHORT).show();
        }


        btnUpload.setOnClickListener(v -> {

                Intent intent = new Intent(IdentityVerificationActivity.this, UploadIdentityActivity.class);
                startActivity(intent);

        });
        btnUpdate.setOnClickListener(v -> {
                Intent intent = new Intent(IdentityVerificationActivity.this, UpdateIdentityActivity.class);
                startActivity(intent);
                finish();
        });
    }



}
