package com.example.housekeeperapplication.profile;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Adapter.ProfileOptionAdapter;
import com.example.housekeeperapplication.ProfileOption;
import com.example.housekeeperapplication.R;

import java.util.Arrays;
import java.util.List;

public class FamilyProfile extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_family_profile);

        RecyclerView recyclerView = findViewById(R.id.recyclerViewOptions);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        List<ProfileOption> options = Arrays.asList(
                new ProfileOption("Ví", R.drawable.ic_wallet),
                new ProfileOption("Thanh toán", R.drawable.ic_payment),
                new ProfileOption("Trung tâm hỗ trợ", R.drawable.ic_support),
                new ProfileOption("Chính sách & Quy định", R.drawable.ic_policy),
                new ProfileOption("Cài đặt", R.drawable.ic_settings)
        );

        ProfileOptionAdapter adapter = new ProfileOptionAdapter(options, option -> {
            // Xử lý khi người dùng nhấn vào một mục
        });

        recyclerView.setAdapter(adapter);
    }
}