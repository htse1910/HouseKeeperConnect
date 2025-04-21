package com.example.housekeeperapplication;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.HousekeeperAdapter;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayForFamilyDTO;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeActivity extends AppCompatActivity {

    private RecyclerView recyclerJobs;
    private HousekeeperAdapter adapter;
    private List<HousekeeperDisplayForFamilyDTO> housekeeperList = new ArrayList<>();
    private APIServices apiService;
    private TextView greetingTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        // 👋 Set greeting with actual name
        greetingTextView = findViewById(R.id.tvGreeting);
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        String name = prefs.getString("name", "");
        greetingTextView.setText("Chào " + name + " 👋");

        // Recycler setup
        recyclerJobs = findViewById(R.id.recyclerJobs);
        recyclerJobs.setLayoutManager(new LinearLayoutManager(this));

        adapter = new HousekeeperAdapter(this, housekeeperList);
        recyclerJobs.setAdapter(adapter);

        apiService = APIClient.getClient(this).create(APIServices.class);
        loadHousekeepers();
    }

    private void loadHousekeepers() {
        apiService.getHousekeepersForFamily(1, 100).enqueue(new Callback<List<HousekeeperDisplayForFamilyDTO>>() {
            @Override
            public void onResponse(Call<List<HousekeeperDisplayForFamilyDTO>> call, Response<List<HousekeeperDisplayForFamilyDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<HousekeeperDisplayForFamilyDTO> displayList = response.body();

                    for (HousekeeperDisplayForFamilyDTO hk : displayList) {
                        apiService.getAccountById(hk.getAccountID()).enqueue(new Callback<Account>() {
                            @Override
                            public void onResponse(Call<Account> call, Response<Account> accountResponse) {
                                if (accountResponse.isSuccessful() && accountResponse.body() != null) {
                                    Account acc = accountResponse.body();
                                    if (acc.getRoleID() == 1) {
                                        hk.setName(acc.getName());
                                        housekeeperList.add(hk);
                                        adapter.notifyItemInserted(housekeeperList.size() - 1);
                                    }
                                }
                            }

                            @Override
                            public void onFailure(Call<Account> call, Throwable t) {
                                Log.e("API", "Failed to fetch account: " + t.getMessage());
                            }
                        });
                    }
                }
            }

            @Override
            public void onFailure(Call<List<HousekeeperDisplayForFamilyDTO>> call, Throwable t) {
                Toast.makeText(HomeActivity.this, "Failed to load housekeepers", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
