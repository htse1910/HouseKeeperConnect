package com.example.housekeeperapplication;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.FamilyJobAdapter;
import com.example.housekeeperapplication.Model.DTOs.FamilyJobSummaryDTO;
import com.example.housekeeperapplication.R;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FamilyJobListActivity extends AppCompatActivity {

    private RecyclerView recyclerJobs;
    private FamilyJobAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_job_list);

        recyclerJobs = findViewById(R.id.recyclerFamilyJobs);
        recyclerJobs.setLayoutManager(new LinearLayoutManager(this));

        int accountId = getSharedPreferences("user_prefs", MODE_PRIVATE).getInt("accountID", -1);

        if (accountId == -1) {
            Toast.makeText(this, "Không tìm thấy tài khoản người dùng", Toast.LENGTH_SHORT).show();
            return;
        }

        APIServices api = APIClient.getClient(this).create(APIServices.class);
        api.getJobsByAccountID(accountId, 1, 100).enqueue(new Callback<List<FamilyJobSummaryDTO>>() {
            @Override
            public void onResponse(Call<List<FamilyJobSummaryDTO>> call, Response<List<FamilyJobSummaryDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter = new FamilyJobAdapter(FamilyJobListActivity.this, response.body());
                    recyclerJobs.setAdapter(adapter);
                } else {
                    Toast.makeText(FamilyJobListActivity.this, "Không tải được công việc", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<FamilyJobSummaryDTO>> call, Throwable t) {
                Toast.makeText(FamilyJobListActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", t.getMessage());
            }
        });
    }
}
