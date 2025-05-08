package com.example.housekeeperapplication;

import android.content.SharedPreferences;
import android.os.Bundle;
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
import com.example.housekeeperapplication.Adapter.SkillAdapter;
import com.example.housekeeperapplication.Model.DTOs.HouseKeeperSkillDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperSkillMappingDisplayDTO;

import java.util.ArrayList;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HousekeeperSkillActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private SkillAdapter adapter;
    private List<HouseKeeperSkillDisplayDTO> allSkills = new ArrayList<>();
    private List<HousekeeperSkillMappingDisplayDTO> mySkills = new ArrayList<>();
    private APIServices apiService;
    private int accountId;
    private int housekeeperId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_housekeeper_skill);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        accountId = prefs.getInt("accountID", -1);
        housekeeperId = prefs.getInt("housekeeperID", -1);

        apiService = APIClient.getClient(this).create(APIServices.class);

        initViews();
        loadData();
    }

    private void initViews() {
        recyclerView = findViewById(R.id.recyclerViewSkills);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        adapter = new SkillAdapter(allSkills, mySkills, new SkillAdapter.SkillActionListener() {
            @Override
            public void onAddSkill(int skillId) {
                addSkill(skillId);
            }

            @Override
            public void onRemoveSkill(int skillId) {
                removeSkill(skillId);
            }
        });

        recyclerView.setAdapter(adapter);
    }

    private void loadData() {
        Call<List<HouseKeeperSkillDisplayDTO>> allSkillsCall = apiService.getAllHousekeeperSkills(1, 100);
        allSkillsCall.enqueue(new Callback<List<HouseKeeperSkillDisplayDTO>>() {
            @Override
            public void onResponse(Call<List<HouseKeeperSkillDisplayDTO>> call, Response<List<HouseKeeperSkillDisplayDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    allSkills.clear();
                    allSkills.addAll(response.body());
                    adapter.notifyDataSetChanged();
                }
            }

            @Override
            public void onFailure(Call<List<HouseKeeperSkillDisplayDTO>> call, Throwable t) {
                Toast.makeText(HousekeeperSkillActivity.this,
                        "Lỗi tải danh sách kỹ năng: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });

        // Load kỹ năng của tôi
        if (accountId != -1) {
            Call<List<HousekeeperSkillMappingDisplayDTO>> mySkillsCall = apiService.getSkillsByAccountId(accountId);
            mySkillsCall.enqueue(new Callback<List<HousekeeperSkillMappingDisplayDTO>>() {
                @Override
                public void onResponse(Call<List<HousekeeperSkillMappingDisplayDTO>> call, Response<List<HousekeeperSkillMappingDisplayDTO>> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        mySkills.clear();
                        mySkills.addAll(response.body());
                        adapter.notifyDataSetChanged();
                    }
                }

                @Override
                public void onFailure(Call<List<HousekeeperSkillMappingDisplayDTO>> call, Throwable t) {
                    Toast.makeText(HousekeeperSkillActivity.this,
                            "Lỗi tải kỹ năng của tôi: " + t.getMessage(),
                            Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private void addSkill(int skillId) {
        if (accountId == -1) return;

        Call<ResponseBody> call = apiService.addSkillToHousekeeper(accountId, skillId);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(HousekeeperSkillActivity.this,
                            "Đã thêm kỹ năng thành công",
                            Toast.LENGTH_SHORT).show();
                    loadData(); // Refresh danh sách
                } else {
                    Toast.makeText(HousekeeperSkillActivity.this,
                            "Lỗi khi thêm kỹ năng",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(HousekeeperSkillActivity.this,
                        "Lỗi mạng: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void removeSkill(int skillId) {
        if (accountId == -1) return;

        Call<ResponseBody> call = apiService.removeSkillFromHousekeeper(accountId, skillId);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(HousekeeperSkillActivity.this,
                            "Đã xóa kỹ năng thành công",
                            Toast.LENGTH_SHORT).show();
                    loadData(); // Refresh danh sách
                } else {
                    Toast.makeText(HousekeeperSkillActivity.this,
                            "Lỗi khi xóa kỹ năng",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(HousekeeperSkillActivity.this,
                        "Lỗi mạng: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }
}