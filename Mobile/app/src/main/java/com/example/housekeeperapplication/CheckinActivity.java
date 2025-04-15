package com.example.housekeeperapplication;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class CheckinActivity extends AppCompatActivity {

    ImageView img1, img2, img3;
    Button btnUpload;
    int currentSlot = 0;
    boolean[] imageFilled = {false, false, false};

    private static final int REQUEST_CAMERA_PERMISSION = 100;

    ActivityResultLauncher<Intent> imagePickerLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_checkin);

        img1 = findViewById(R.id.imgMedia1);
        img2 = findViewById(R.id.imgMedia2);
        img3 = findViewById(R.id.imgMedia3);
        btnUpload = findViewById(R.id.btnUpload);

        img1.setOnClickListener(v -> openImagePicker(0));
        img2.setOnClickListener(v -> openImagePicker(1));
        img3.setOnClickListener(v -> openImagePicker(2));

        btnUpload.setOnClickListener(v -> {
            Toast.makeText(this, "Đã gửi báo cáo hoàn thành!", Toast.LENGTH_SHORT).show();
            // Gọi API gửi ảnh tại đây nếu cần
        });

        // Launcher xử lý kết quả chọn/chụp ảnh
        imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                new ActivityResultCallback<ActivityResult>() {
                    @Override
                    public void onActivityResult(ActivityResult result) {
                        if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                            Intent data = result.getData();
                            Bitmap bitmap = null;

                            if (data.getExtras() != null && data.getExtras().get("data") instanceof Bitmap) {
                                // Camera trả về Bitmap
                                bitmap = (Bitmap) data.getExtras().get("data");
                            } else if (data.getData() != null) {
                                // Gallery trả về Uri
                                Uri selectedImageUri = data.getData();
                                try {
                                    bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), selectedImageUri);
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }

                            if (bitmap != null) {
                                if (currentSlot == 0) {
                                    img1.setImageBitmap(bitmap);
                                    imageFilled[0] = true;
                                } else if (currentSlot == 1) {
                                    img2.setImageBitmap(bitmap);
                                    imageFilled[1] = true;
                                } else {
                                    img3.setImageBitmap(bitmap);
                                    imageFilled[2] = true;
                                }
                            }

                            updateButtonState();
                        }
                    }
                }
        );
    }

    private void openImagePicker(int slot) {
        currentSlot = slot;

        String[] options = {"Chụp ảnh", "Chọn từ thư viện"};
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(this);
        builder.setTitle("Chọn ảnh")
                .setItems(options, (dialog, which) -> {
                    if (which == 0) {
                        // Chụp ảnh
                        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERMISSION);
                        } else {
                            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                            imagePickerLauncher.launch(takePictureIntent);
                        }
                    } else {
                        // Chọn từ thư viện
                        Intent pickPhoto = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        imagePickerLauncher.launch(pickPhoto);
                    }
                }).show();
    }

    private void updateButtonState() {
        btnUpload.setEnabled(imageFilled[0] && imageFilled[1] && imageFilled[2]);
    }

    // Xử lý khi user cho phép camera
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == REQUEST_CAMERA_PERMISSION && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            imagePickerLauncher.launch(takePictureIntent);
        } else {
            Toast.makeText(this, "Bạn cần cấp quyền camera để sử dụng tính năng này.", Toast.LENGTH_SHORT).show();
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
