package com.example.housekeeperapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class Register extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_register);

        LinearLayout btnLoginNow = findViewById(R.id.btn_login_now);
        btnLoginNow.setOnClickListener(v -> {
            Intent intent = new Intent(Register.this, LoginActivity.class);
            startActivity(intent);
            finish(); // Đóng màn hình đăng ký
        });
    }
}