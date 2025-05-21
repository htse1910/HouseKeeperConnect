package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.JobApplicationAdapter;
import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.Model.CombinedJobApplication;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HousekeeperJob extends AppCompatActivity {

    private static final int PAGE_SIZE = 10;
    private int currentPage = 1;
    private boolean isLoading = false;
    private boolean isLastPage = false;

    private RecyclerView recyclerViewJobs;
    private ProgressBar progressBar;
    private TextView tvEmptyView;
    private JobApplicationAdapter adapter;
    private List<CombinedJobApplication> combinedJobs = new ArrayList<>();
    private APIServices api;
    private int accountID;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_housekeeper_job);

        api = APIClient.getClient(this).create(APIServices.class);
        accountID = getCurrentAccountID();

        initializeViews();
        setupRecyclerView();
        loadInitialData();
    }

    private void initializeViews() {
        recyclerViewJobs = findViewById(R.id.recyclerViewJobs);
        progressBar = findViewById(R.id.progressBar);
        tvEmptyView = findViewById(R.id.tvEmptyView);
    }

    private void setupRecyclerView() {
        adapter = new JobApplicationAdapter(combinedJobs, job -> {

        });

        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerViewJobs.setLayoutManager(layoutManager);
        recyclerViewJobs.setAdapter(adapter);

        // Thêm phân trang
        recyclerViewJobs.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                int visibleItemCount = layoutManager.getChildCount();
                int totalItemCount = layoutManager.getItemCount();
                int firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition();

                if (!isLoading && !isLastPage) {
                    if ((visibleItemCount + firstVisibleItemPosition) >= totalItemCount
                            && firstVisibleItemPosition >= 0
                            && totalItemCount >= PAGE_SIZE) {
                        loadMoreData();
                    }
                }
            }
        });
    }

    private void loadInitialData() {
        showLoading(true);
        currentPage = 1;
        isLastPage = false;
        combinedJobs.clear();
        adapter.notifyDataSetChanged();

        fetchApplications(currentPage);
    }

    private void loadMoreData() {
        if (!isLastPage) {
            showLoading(true);
            currentPage++;
            fetchApplications(currentPage);
        }
    }

    private void fetchApplications(int page) {
        isLoading = true;

        api.getApplicationsByAccountId(accountID, page, PAGE_SIZE).enqueue(new Callback<List<ApplicationDisplayDTO>>() {
            @Override
            public void onResponse(Call<List<ApplicationDisplayDTO>> call, Response<List<ApplicationDisplayDTO>> response) {
                isLoading = false;
                showLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    List<ApplicationDisplayDTO> newApplications = response.body();

                    if (newApplications.isEmpty()) {
                        isLastPage = true;
                        if (currentPage == 1) {
                            showEmptyView("Bạn chưa ứng tuyển công việc nào");
                        }
                        return;
                    }

                    processApplications(newApplications);
                } else {
                    handleErrorResponse();
                }
            }

            @Override
            public void onFailure(Call<List<ApplicationDisplayDTO>> call, Throwable t) {
                isLoading = false;
                showLoading(false);
                handleNetworkError(t);
            }
        });
    }

    private void processApplications(List<ApplicationDisplayDTO> applications) {
        for (ApplicationDisplayDTO application : applications) {
            fetchJobDetails(application);
        }
    }

    private void fetchJobDetails(ApplicationDisplayDTO application) {
        api.getJobDetailByID(application.getJobID()).enqueue(new Callback<JobDetailForBookingDTO>() {
            @Override
            public void onResponse(Call<JobDetailForBookingDTO> call, Response<JobDetailForBookingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    combinedJobs.add(new CombinedJobApplication(application, response.body()));
                    adapter.notifyItemInserted(combinedJobs.size() - 1);
                }
            }

            @Override
            public void onFailure(Call<JobDetailForBookingDTO> call, Throwable t) {
                Toast.makeText(HousekeeperJob.this,
                        "Lỗi khi tải chi tiết công việc ID: " + application.getJobID(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }



    private int getCurrentAccountID() {
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        return prefs.getInt("accountID", -1);
    }

    private void showLoading(boolean show) {
        progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
    }

    private void showEmptyView(String message) {
        tvEmptyView.setText(message);
        tvEmptyView.setVisibility(View.VISIBLE);
        recyclerViewJobs.setVisibility(View.GONE);
    }

    private void handleErrorResponse() {
        if (combinedJobs.isEmpty()) {
            showEmptyView("Lỗi khi tải dữ liệu");
        } else {
            Toast.makeText(this, "Lỗi khi tải thêm dữ liệu", Toast.LENGTH_SHORT).show();
        }
    }

    private void handleNetworkError(Throwable t) {
        if (combinedJobs.isEmpty()) {
            showEmptyView("Lỗi kết nối mạng");
        }
        Toast.makeText(this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
    }
}