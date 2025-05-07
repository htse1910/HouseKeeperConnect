package com.example.housekeeperapplication;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.JobApplicationAdapter;
import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailPageDTO;
import com.example.housekeeperapplication.Model.DTOs.JobItem;

import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HousekeeperJob extends AppCompatActivity {
    private RecyclerView recyclerView;
    private JobApplicationAdapter adapter;
    private List<JobItem> jobItems = new ArrayList<>();
    private SharedPreferences sharedPreferences;
    private APIServices apiServices;
    private ProgressBar progressBar;
    private TextView tvEmptyView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_housekeeper_job);

        // Initialize views
        recyclerView = findViewById(R.id.recyclerViewJobs);
        progressBar = findViewById(R.id.progressBar);
        tvEmptyView = findViewById(R.id.tvEmptyView);

        // Setup RecyclerView
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new JobApplicationAdapter(jobItems, this::showJobDetailDialog);
        recyclerView.setAdapter(adapter);

        // Initialize API service and shared preferences
        sharedPreferences = getSharedPreferences("user_prefs", MODE_PRIVATE);
        apiServices = APIClient.getClient(this).create(APIServices.class);

        // Load data
        loadJobApplications();
    }

    private void loadJobApplications() {
        int accountID = sharedPreferences.getInt("accountID", 0);
        if (accountID == 0) {
            showError("Vui lòng đăng nhập lại");
            return;
        }

        showLoading(true);

        apiServices.getApplicationsByAccountId(accountID, 1, 10).enqueue(new Callback<List<ApplicationDisplayDTO>>() {
            @Override
            public void onResponse(Call<List<ApplicationDisplayDTO>> call, Response<List<ApplicationDisplayDTO>> response) {
                if (response.isSuccessful() && response.body() != null && !response.body().isEmpty()) {
                    processApplications(response.body());
                } else {
                    showEmptyView("Không có công việc nào");
                }
            }

            @Override
            public void onFailure(Call<List<ApplicationDisplayDTO>> call, Throwable t) {
                showError("Lỗi kết nối: " + t.getMessage());
            }
        });
    }

    private void processApplications(List<ApplicationDisplayDTO> applications) {
        jobItems.clear();
        adapter.notifyDataSetChanged();

        if (applications == null || applications.isEmpty()) {
            showEmptyView("Không có công việc nào");
            return;
        }

        AtomicInteger counter = new AtomicInteger(0);
        int totalApplications = applications.size();

        for (ApplicationDisplayDTO app : applications) {
            if (app.getJobID() <= 0) {
                if (counter.incrementAndGet() == totalApplications) {
                    checkComplete(counter.get(), totalApplications);
                }
                continue;
            }

            apiServices.getJobDetailByID(app.getJobID()).enqueue(new Callback<JobDetailForBookingDTO>() {
                @Override
                public void onResponse(Call<JobDetailForBookingDTO> call, Response<JobDetailForBookingDTO> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        JobDetailForBookingDTO jobDetail = response.body();

                        apiServices.getFamilyByID(jobDetail.getFamilyID()).enqueue(new Callback<FamilyAccountMappingDTO>() {
                            @Override
                            public void onResponse(Call<FamilyAccountMappingDTO> call, Response<FamilyAccountMappingDTO> response) {
                                if (response.isSuccessful() && response.body() != null) {
                                    FamilyAccountMappingDTO family = response.body();

                                    JobItem item = new JobItem(
                                            jobDetail.getJobID(),
                                            jobDetail.getJobName(),
                                            family.getName(),
                                            jobDetail.getPrice(),
                                            formatDate(jobDetail.getStartDate()),
                                            formatDate(jobDetail.getEndDate()),
                                            app.getStatus()
                                    );

                                    runOnUiThread(() -> {
                                        jobItems.add(item);
                                        checkComplete(counter.incrementAndGet(), totalApplications);
                                    });
                                } else {
                                    checkComplete(counter.incrementAndGet(), totalApplications);
                                }
                            }

                            @Override
                            public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                                checkComplete(counter.incrementAndGet(), totalApplications);
                            }
                        });
                    } else {
                        checkComplete(counter.incrementAndGet(), totalApplications);
                    }
                }

                @Override
                public void onFailure(Call<JobDetailForBookingDTO> call, Throwable t) {
                    checkComplete(counter.incrementAndGet(), totalApplications);
                }
            });
        }
    }

    private void checkComplete(int currentCount, int total) {
        runOnUiThread(() -> {
            if (currentCount == total) {
                showLoading(false);
                adapter.notifyDataSetChanged();

                if (jobItems.isEmpty()) {
                    showEmptyView("Không có công việc nào để hiển thị");
                } else {
                    Toast.makeText(HousekeeperJob.this,
                            "Đã tải " + jobItems.size() + "/" + total + " công việc",
                            Toast.LENGTH_SHORT).show();
                }
            }
        });
    }


    private void handlePartialError(AtomicInteger counter, int total) {
        runOnUiThread(() -> {
            if (counter.incrementAndGet() == total && jobItems.isEmpty()) {
                showError("Không thể tải danh sách công việc");
            } else if (counter.get() == total) {
                showLoading(false);
                Toast.makeText(HousekeeperJob.this,
                        "Đã tải " + jobItems.size() + "/" + total + " công việc",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showJobDetailDialog(JobItem jobItem) {
        Dialog dialog = new Dialog(this, R.style.Theme_HouseKeeperApplication);
        dialog.setContentView(R.layout.dialog_job_hk_detail);
        dialog.setCancelable(true);

        // Setup views
        TextView tvJobName = dialog.findViewById(R.id.tvJobName);
        TextView tvJobLocation = dialog.findViewById(R.id.tvJobLocation);
        TextView tvJobDescription = dialog.findViewById(R.id.tvJobDescription);
        TextView tvJobTime = dialog.findViewById(R.id.tvJobTime);
        TextView tvJobSalary = dialog.findViewById(R.id.tvJobSalary);
        TextView tvJobType = dialog.findViewById(R.id.tvJobType);
        ImageView btnClose = dialog.findViewById(R.id.btnClose);
        Button btnReject = dialog.findViewById(R.id.btnReject);
        Button btnAccept = dialog.findViewById(R.id.btnAccept);
        Button btnCloseDialog = dialog.findViewById(R.id.btnCloseDialog);

        // Set data
        tvJobName.setText(jobItem.getJobName());
        tvJobTime.setText(jobItem.getStartDate() + " → " + jobItem.getEndDate());
        tvJobSalary.setText(formatCurrency(jobItem.getSalary()));

        // Set job type based on status
        String jobType = "Thường xuyên";
        if (jobItem.getStatus() == 0) {
            jobType = "Một lần";
        }
        tvJobType.setText(jobType);

        // Setup buttons
        btnClose.setOnClickListener(v -> dialog.dismiss());
        btnCloseDialog.setOnClickListener(v -> dialog.dismiss());

        btnAccept.setOnClickListener(v -> {
            handleJobAction(jobItem.getJobId(), "accept");
            dialog.dismiss();
        });

        btnReject.setOnClickListener(v -> {
            handleJobAction(jobItem.getJobId(), "reject");
            dialog.dismiss();
        });

        // Show dialog
        dialog.show();

        // Adjust dialog width
        Window window = dialog.getWindow();
        if (window != null) {
            window.setLayout(WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT);
        }
    }

    private void handleJobAction(int jobId, String action) {
        // Implement your job accept/reject logic here
        Toast.makeText(this, "Đã " + (action.equals("accept") ? "chấp nhận" : "từ chối") + " công việc",
                Toast.LENGTH_SHORT).show();

        // Refresh the list after action
        loadJobApplications();
    }

    private String formatDate(String dateString) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            Date date = inputFormat.parse(dateString);
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return dateString; // Trả về nguyên bản nếu không parse được
        }
    }

    private String formatCurrency(double amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return format.format(amount);
    }

    private void showLoading(boolean show) {
        runOnUiThread(() -> {
            progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
            recyclerView.setVisibility(show ? View.GONE : View.VISIBLE);
            tvEmptyView.setVisibility(View.GONE);
        });
    }

    private void showEmptyView(String message) {
        runOnUiThread(() -> {
            progressBar.setVisibility(View.GONE);
            recyclerView.setVisibility(View.GONE);
            tvEmptyView.setVisibility(View.VISIBLE);
            tvEmptyView.setText(message);
        });
    }

    private void showError(String message) {
        runOnUiThread(() -> {
            progressBar.setVisibility(View.GONE);
            Toast.makeText(HousekeeperJob.this, message, Toast.LENGTH_SHORT).show();
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Cancel ongoing API calls if needed
    }
}