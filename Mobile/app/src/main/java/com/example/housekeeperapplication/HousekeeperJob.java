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

import java.io.IOException;
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
        adapter = new JobApplicationAdapter(jobItems, this::showJobDetailDialog, this);
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

        Log.d("API_DEBUG", "Total applications: " + applications.size());

        AtomicInteger counter = new AtomicInteger(0);
        int totalApplications = applications.size();

        for (ApplicationDisplayDTO app : applications) {
            Log.d("API_DEBUG", "Processing application - JobID: " + app.getJobID() + ", Status: " + app.getStatus());

            if (app.getJobID() <= 0) {
                Log.d("API_DEBUG", "Skipping invalid JobID: " + app.getJobID());
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
                        Log.d("API_DEBUG", "Got job detail for JobID: " + jobDetail.getJobID());

                        apiServices.getFamilyByID(jobDetail.getFamilyID()).enqueue(new Callback<FamilyAccountMappingDTO>() {
                            @Override
                            public void onResponse(Call<FamilyAccountMappingDTO> call, Response<FamilyAccountMappingDTO> response) {
                                if (response.isSuccessful() && response.body() != null) {
                                    FamilyAccountMappingDTO family = response.body();
                                    Log.d("API_DEBUG", "Got family info for FamilyID: " + family.getFamilyID());

                                    JobItem item = new JobItem(
                                            jobDetail.getJobID(),
                                            jobDetail.getJobName(),
                                            family.getName(),
                                            jobDetail.getPrice(),
                                            formatDate(jobDetail.getStartDate()),
                                            formatDate(jobDetail.getEndDate()),
                                            app.getStatus(),
                                            jobDetail.getFamilyID()
                                    );

                                    runOnUiThread(() -> {
                                        jobItems.add(item);
                                        Log.d("API_DEBUG", "Added job item: " + item.getJobName());
                                        checkComplete(counter.incrementAndGet(), totalApplications);
                                    });
                                } else {
                                    Log.e("API_ERROR", "Failed to get family info: " + response.code());
                                    checkComplete(counter.incrementAndGet(), totalApplications);
                                }
                            }

                            @Override
                            public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                                Log.e("API_ERROR", "Family API call failed", t);
                                checkComplete(counter.incrementAndGet(), totalApplications);
                            }
                        });
                    } else {
                        Log.e("API_ERROR", "Failed to get job detail: " + response.code());
                        checkComplete(counter.incrementAndGet(), totalApplications);
                    }
                }

                @Override
                public void onFailure(Call<JobDetailForBookingDTO> call, Throwable t) {
                    Log.e("API_ERROR", "JobDetail API call failed", t);
                    checkComplete(counter.incrementAndGet(), totalApplications);
                }
            });
        }
    }

    private void checkComplete(int currentCount, int total) {
        Log.d("API_DEBUG", "Progress: " + currentCount + "/" + total);

        runOnUiThread(() -> {
            if (currentCount == total) {
                showLoading(false);
                adapter.notifyDataSetChanged();

                if (jobItems.isEmpty()) {
                    Log.d("API_DEBUG", "No items to display");
                    showEmptyView("Không có công việc nào để hiển thị");
                } else {
                    Log.d("API_DEBUG", "Displaying " + jobItems.size() + " items");
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
        // Setup buttons
        btnClose.setOnClickListener(v -> dialog.dismiss());
        btnCloseDialog.setOnClickListener(v -> dialog.dismiss());

        btnAccept.setOnClickListener(v -> {
            // Hiển thị dialog xác nhận
            new AlertDialog.Builder(this)
                    .setTitle("Xác nhận")
                    .setMessage("Bạn có chắc chắn muốn chấp nhận công việc này?")
                    .setPositiveButton("Đồng ý", (dialogInterface, which) -> {
                        handleJobAction(jobItem.getJobId(), "accept");
                        dialog.dismiss();
                    })
                    .setNegativeButton("Hủy", null)
                    .show();
        });

        btnReject.setOnClickListener(v -> {
            // Hiển thị dialog xác nhận
            new AlertDialog.Builder(this)
                    .setTitle("Xác nhận")
                    .setMessage("Bạn có chắc chắn muốn từ chối công việc này?")
                    .setPositiveButton("Đồng ý", (dialogInterface, which) -> {
                        handleJobAction(jobItem.getJobId(), "reject");
                        dialog.dismiss();
                    })
                    .setNegativeButton("Hủy", null)
                    .show();
        });

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
        int accountId = sharedPreferences.getInt("accountID", 0);
        if (accountId == 0) {
            Toast.makeText(this, "Vui lòng đăng nhập lại", Toast.LENGTH_SHORT).show();
            return;
        }

        showLoading(true);

        if (action.equals("accept")) {
            // Gọi API AcceptJob
            apiServices.acceptJob(jobId, accountId).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    showLoading(false);
                    if (response.isSuccessful()) {
                        Toast.makeText(HousekeeperJob.this,
                                "Đã chấp nhận công việc thành công",
                                Toast.LENGTH_SHORT).show();
                        loadJobApplications(); // Refresh danh sách
                    } else {
                        try {
                            String errorBody = response.errorBody().string();
                            Toast.makeText(HousekeeperJob.this,
                                    "Lỗi khi chấp nhận: " + errorBody,
                                    Toast.LENGTH_SHORT).show();
                        } catch (IOException e) {
                            Toast.makeText(HousekeeperJob.this,
                                    "Lỗi khi chấp nhận công việc",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    showLoading(false);
                    Toast.makeText(HousekeeperJob.this,
                            "Lỗi kết nối: " + t.getMessage(),
                            Toast.LENGTH_SHORT).show();
                }
            });
        } else {
            // Gọi API DenyJob
            apiServices.denyJob(jobId, accountId).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    showLoading(false);
                    if (response.isSuccessful()) {
                        Toast.makeText(HousekeeperJob.this,
                                "Đã từ chối công việc thành công",
                                Toast.LENGTH_SHORT).show();
                        loadJobApplications(); // Refresh danh sách
                    } else {
                        try {
                            String errorBody = response.errorBody().string();
                            Toast.makeText(HousekeeperJob.this,
                                    "Lỗi khi từ chối: " + errorBody,
                                    Toast.LENGTH_SHORT).show();
                        } catch (IOException e) {
                            Toast.makeText(HousekeeperJob.this,
                                    "Lỗi khi từ chối công việc",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    showLoading(false);
                    Toast.makeText(HousekeeperJob.this,
                            "Lỗi kết nối: " + t.getMessage(),
                            Toast.LENGTH_SHORT).show();
                }
            });
        }
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