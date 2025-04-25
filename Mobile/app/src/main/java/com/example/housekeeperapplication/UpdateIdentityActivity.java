package com.example.housekeeperapplication;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UpdateIdentityActivity extends AppCompatActivity {
    private static final int REQUEST_CODE_PERMISSIONS = 200;
    private static final int PICK_IMAGE_FRONT = 1;
    private static final int PICK_IMAGE_BACK = 2;
    private static final int PICK_IMAGE_PORTRAIT = 3;

    private Uri frontUri, backUri, portraitUri;
    private String frontPath, backPath, portraitPath;

    Button btnFront, btnBack, btnPortrait, btnSubmit;
    private APIServices apiServices;
    private ImageView frontV,backV, faceV;
    private SharedPreferences sharedPreferences;

    private  int verifyID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_update_identity);

        btnFront = findViewById(R.id.btnUploadFront);
        btnBack = findViewById(R.id.btnUploadBack);
        btnPortrait = findViewById(R.id.btnUploadPortrait);
        btnSubmit = findViewById(R.id.btnSubmit);

        frontV = findViewById(R.id.imgFront);
        backV = findViewById(R.id.imgBack);
        faceV = findViewById(R.id.imgPortrait);

        sharedPreferences = getSharedPreferences("user_prefs", MODE_PRIVATE);
        apiServices = APIClient.getClient(this).create(APIServices.class);

        btnFront.setOnClickListener(v -> requestPermission(PICK_IMAGE_FRONT));
        btnBack.setOnClickListener(v -> requestPermission(PICK_IMAGE_BACK));
        btnPortrait.setOnClickListener(v -> requestPermission(PICK_IMAGE_PORTRAIT));

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1); // -1 nếu chưa login
        apiServices = APIClient.getClient(UpdateIdentityActivity.this).create(APIServices.class);
        Call<Housekeeper> call = apiServices.getHousekeeperByAccountID(accountId);

        call.enqueue(new Callback<Housekeeper>() {
            @Override
            public void onResponse(Call<Housekeeper> call, Response<Housekeeper> response) {
                if (response.isSuccessful()) {
                    Housekeeper hk = response.body();
                    verifyID = hk.getVerifyID();
                } else {
                    Toast.makeText(UpdateIdentityActivity.this, "Không tìm thấy Housekeeper", Toast.LENGTH_SHORT).show();
                }

            }

            @Override
            public void onFailure(Call<Housekeeper> call, Throwable t) {
                Toast.makeText(UpdateIdentityActivity.this, "Lỗi server: " + t.getMessage() , Toast.LENGTH_SHORT).show();
                Log.d("HousekeeperInfo", t.getMessage() );
            }
        });

        btnSubmit.setOnClickListener(v -> {
            if (frontPath != null && backPath != null && portraitPath != null) {
                updateImages(verifyID);

            } else {
                Toast.makeText(this, "Vui lòng chọn đủ 3 ảnh", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void requestPermission(int code) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_MEDIA_IMAGES}, REQUEST_CODE_PERMISSIONS + code);
        } else {
            pickImage(code);
        }
    }

    private void pickImage(int requestCode) {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(intent, requestCode);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && data != null) {
            Uri uri = data.getData();
            String realPath = getRealPathFromURI(uri);
            switch (requestCode) {
                case PICK_IMAGE_FRONT:
                    frontUri = uri;
                    frontPath = realPath;
                    Picasso.get().load(frontUri).into(frontV);
                    break;
                case PICK_IMAGE_BACK:
                    backUri = uri;
                    backPath = realPath;
                    Picasso.get().load(backUri).into(backV);
                    break;
                case PICK_IMAGE_PORTRAIT:
                    portraitUri = uri;
                    portraitPath = realPath;
                    Picasso.get().load(portraitUri).into(faceV);
                    break;
            }
        }
    }

    private void updateImages(int verifyId) {
        File frontFile = new File(frontPath);
        File backFile = new File(backPath);
        File portraitFile = new File(portraitPath);
        RequestBody verifyID = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(verifyId));
        MultipartBody.Part FrontPhoto = MultipartBody.Part.createFormData("FrontPhoto", frontFile.getName(),
                RequestBody.create(MediaType.parse("image/*"), frontFile));
        MultipartBody.Part BackPhoto = MultipartBody.Part.createFormData("BackPhoto", backFile.getName(),
                RequestBody.create(MediaType.parse("image/*"), backFile));
        MultipartBody.Part FacePhoto = MultipartBody.Part.createFormData("FacePhoto", portraitFile.getName(),
                RequestBody.create(MediaType.parse("image/*"), portraitFile));

        Call<ResponseBody> call = apiServices.updateIDVerification(verifyID, FrontPhoto, BackPhoto, FacePhoto);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(UpdateIdentityActivity.this, "Cập nhật ảnh thành công!", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(UpdateIdentityActivity.this, IdentityVerificationActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(UpdateIdentityActivity.this, "Thất bại: " + response.message(), Toast.LENGTH_SHORT).show();
                    try {
                        Log.e("Update", response.errorBody().string());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(UpdateIdentityActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("Update", t.getMessage());
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        int adjustedCode = requestCode - REQUEST_CODE_PERMISSIONS;
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            pickImage(adjustedCode);
        } else {
            Toast.makeText(this, "Không có quyền truy cập ảnh", Toast.LENGTH_SHORT).show();
        }
    }

    private String getRealPathFromURI(Uri uri) {
        String result = null;
        String[] proj = {MediaStore.Images.Media.DATA};
        Cursor cursor = getContentResolver().query(uri, proj, null, null, null);
        if (cursor != null) {
            if (cursor.moveToFirst()) {
                int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                result = cursor.getString(column_index);
            }
            cursor.close();
        }
        if (result == null) {
            result = uri.getPath(); // fallback
        }
        return result;
    }
}
