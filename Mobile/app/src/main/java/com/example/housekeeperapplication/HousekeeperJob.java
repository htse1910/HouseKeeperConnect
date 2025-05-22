package com.example.housekeeperapplication;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
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
import com.example.housekeeperapplication.Model.Service;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;

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
        adapter = new JobApplicationAdapter(this, combinedJobs, job -> {
            // Xử lý khi click vào item
            showJobDetailDialog(job);
        });

        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        recyclerViewJobs.setLayoutManager(layoutManager);
        recyclerViewJobs.setAdapter(adapter);

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

    public void showJobDetailDialog(CombinedJobApplication job) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_job_hk_detail, null);
        builder.setView(dialogView);

        AlertDialog dialog = builder.create();
        dialog.setCancelable(false);
        // Ánh xạ các view
        TextView tvJobName = dialogView.findViewById(R.id.tvJobName);
        TextView tvJobLocation = dialogView.findViewById(R.id.tvJobLocation);
        TextView tvJobDescription = dialogView.findViewById(R.id.tvJobDescription);
        TextView tvJobTime = dialogView.findViewById(R.id.tvJobTime);
        TextView tvJobSalary = dialogView.findViewById(R.id.tvJobSalary);
        TextView tvJobType = dialogView.findViewById(R.id.tvJobType);
        TextView tvJobStatus = dialogView.findViewById(R.id.tvJobStatus);
        TextView tvServices = dialogView.findViewById(R.id.tvServices);
        TextView tvSchedules = dialogView.findViewById(R.id.tvSchedules);
        TextView tvSlots = dialogView.findViewById(R.id.tvSlots);

        Button btnReject = dialogView.findViewById(R.id.btnReject);
        Button btnAccept = dialogView.findViewById(R.id.btnAccept);
        Button btnClose = dialogView.findViewById(R.id.btnCloseDialog);
        // Gán dữ liệu
        tvJobName.setText(job.getJobName());
        tvJobLocation.setText(job.getLocation());
        tvJobDescription.setText(job.getDescription());
        tvJobTime.setText(formatDateRange(job.getStartDate(), job.getEndDate()));
        tvJobSalary.setText(formatCurrency(job.getPrice()));
        tvJobType.setText(getJobTypeText(job.getJobType()));
        tvJobStatus.setText(getStatusText(job.getJobStatus(), job.getJobStatus() == 4));
        tvSchedules.setText(formatDays(job.getDayofWeek()));
        tvSlots.setText(formatSlots(job.getSlotIDs()));
        if (job.getServiceNames() != null && !job.getServiceNames().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            for (String name : job.getServiceNames()) {
                sb.append("• ").append(name).append("\n");
            }
            tvServices.setText(sb.toString());
        } else {
            tvServices.setText("Chưa có thông tin dịch vụ");
        }

        boolean shouldShowButtons = (job.getJobStatus() == 2 && job.getAplicationStatus() == 2);
        btnReject.setVisibility(shouldShowButtons ? View.VISIBLE : View.GONE);
        btnAccept.setVisibility(shouldShowButtons ? View.VISIBLE : View.GONE);

        btnReject.setOnClickListener(v -> {
            rejectJob(job.getJobID());
            dialog.dismiss();
        });

        btnAccept.setOnClickListener(v -> {
            acceptJob(job.getJobID());
            dialog.dismiss();
        });

        btnClose.setOnClickListener(v -> dialog.dismiss());

        // Thêm kiểm tra tránh memory leak
        dialog.setOnDismissListener(d -> {
            btnReject.setOnClickListener(null);
            btnAccept.setOnClickListener(null);
            btnClose.setOnClickListener(null);
        });

        dialog.show();
    }
    private String formatDateRange(String startDate, String endDate) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
        SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());

        try {
            Date start = inputFormat.parse(startDate);
            Date end = inputFormat.parse(endDate);
            return outputFormat.format(start) + " → " + outputFormat.format(end);
        } catch (ParseException e) {
            return startDate + " → " + endDate;
        }
    }

    private String formatCurrency(double amount) {
        return String.format(Locale.getDefault(), "%,.0f VND", amount);
    }

    private String getJobTypeText(int jobType) {
        switch (jobType) {
            case 1: return "Một lần duy nhất";
            case 2: return "Định kỳ";
            default: return "Không xác định";
        }
    }

    private String getStatusText(int status, boolean isCompleted) {
        if (isCompleted) return "✅ Đã hoàn thành";
        switch (status) {
            case 1: return "Công việc đang chờ duyệt";
            case 2: return "Công việc đã xác minh";
            case 3: return "Công việc đã chấp nhận";
            case 4: return "Công việc đã hoàn thành";
            case 5: return "Công việc đã hết hạn";
            case 6: return "Công việc đã hủy";
            case 7: return "Không được phép";
            case 8: return "Công việc đang chờ xác nhận của gia đình";
            case 9: return "Người giúp việc đã nghỉ";
            case 10: return "Công việc đã giao lại";
            default: return "❓ Trạng thái không xác định";
        }
    }
    private String formatDays(List<Integer> dayOfWeekList) {
        StringBuilder days = new StringBuilder();
        for (Integer day : dayOfWeekList) {
            switch (day) {
                case 0: days.append("- Chủ nhật\n"); break;
                case 1: days.append("- Thứ 2\n"); break;
                case 2: days.append("- Thứ 3\n"); break;
                case 3: days.append("- Thứ 4\n"); break;
                case 4: days.append("- Thứ 5\n"); break;
                case 5: days.append("- Thứ 6\n"); break;
                case 6: days.append("- Thứ 7\n"); break;
            }
        }
        return days.toString();
    }

    private String formatSlots(List<Integer> slotIDs) {
        // Giả sử mỗi Slot ID tương ứng với một khung giờ cố định
        StringBuilder slots = new StringBuilder();
        for (Integer slot : slotIDs) {
            switch (slot) {
                case 1: slots.append("- 8H - 9H\n"); break;
                case 2: slots.append("- 9H - 10H\n"); break;
                case 3: slots.append("- 10H - 11H\n"); break;
                case 4: slots.append("- 11H - 12H\n"); break;
                case 5: slots.append("- 12H - 13H\n"); break;
                case 6: slots.append("- 13H - 14H\n"); break;
                case 7: slots.append("- 14H - 15H\n"); break;
                case 8: slots.append("- 15H - 16H\n"); break;
                case 9: slots.append("- 16H - 17H\n"); break;
                case 10: slots.append("- 17H - 18H\n"); break;
                case 11: slots.append("- 18H - 19H\n"); break;
                case 12: slots.append("- 19H - 20H\n"); break;
                // Thêm các Slot khác nếu cần
            }
        }
        return slots.toString();
    }

    private void rejectJob(int jobId) {
        api.denyJob(jobId, accountID).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(HousekeeperJob.this, "Đã từ chối công việc thành công", Toast.LENGTH_SHORT).show();
                    loadInitialData(); // Refresh danh sách
                } else {
                    try {
                        String errorBody = response.errorBody() != null ? response.errorBody().string() : "Lỗi không xác định";
                        Toast.makeText(HousekeeperJob.this, "Lỗi khi từ chối: " + errorBody, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        Toast.makeText(HousekeeperJob.this, "Lỗi khi xử lý phản hồi", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(HousekeeperJob.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void acceptJob(int jobId) {
        api.acceptJob(jobId, accountID).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(HousekeeperJob.this, "Đã chấp nhận công việc thành công", Toast.LENGTH_SHORT).show();
                    loadInitialData(); // Refresh danh sách
                } else {
                    try {
                        String errorBody = response.errorBody() != null ? response.errorBody().string() : "Lỗi không xác định";
                        Toast.makeText(HousekeeperJob.this, "Lỗi khi chấp nhận: " + errorBody, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        Toast.makeText(HousekeeperJob.this, "Lỗi khi xử lý phản hồi", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(HousekeeperJob.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
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
    private interface ServiceFetchCallback {
        void onServicesFetched(List<Service> services);
    }
    private void fetchServiceNames(List<Integer> serviceIDs, ServiceFetchCallback callback) {
        if (serviceIDs == null || serviceIDs.isEmpty()) {
            callback.onServicesFetched(Collections.emptyList());
            return;
        }

        List<Service> services = new ArrayList<>();
        AtomicInteger counter = new AtomicInteger(serviceIDs.size());

        for (Integer serviceID : serviceIDs) {
            api.getServiceByID(serviceID).enqueue(new Callback<Service>() {
                @Override
                public void onResponse(Call<Service> call, Response<Service> response) {
                    synchronized (services) {
                        if (response.isSuccessful() && response.body() != null) {
                            services.add(response.body());
                        }
                    }

                    if (counter.decrementAndGet() == 0) {
                        callback.onServicesFetched(services);
                    }
                }

                @Override
                public void onFailure(Call<Service> call, Throwable t) {
                    if (counter.decrementAndGet() == 0) {
                        callback.onServicesFetched(services);
                    }
                }
            });
        }
    }

    private void fetchJobDetails(ApplicationDisplayDTO application) {
        api.getJobDetailByID(application.getJobID()).enqueue(new Callback<JobDetailForBookingDTO>() {
            @Override
            public void onResponse(Call<JobDetailForBookingDTO> call, Response<JobDetailForBookingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JobDetailForBookingDTO jobDetail = response.body();
                    CombinedJobApplication combinedJob = new CombinedJobApplication(application, jobDetail);

                    // Gọi API để lấy tên dịch vụ
                    fetchServiceNames(jobDetail.getServiceIDs(), new ServiceFetchCallback() {
                        @Override
                        public void onServicesFetched(List<Service> services) {
                            List<String> names = new ArrayList<>();
                            for (Service service : services) {
                                names.add(service.getServiceName());
                            }
                            combinedJob.setServiceNames(names);

                            combinedJobs.add(combinedJob);
                            runOnUiThread(() -> adapter.notifyItemInserted(combinedJobs.size() - 1));
                        }
                    });
                }
            }

            @Override
            public void onFailure(Call<JobDetailForBookingDTO> call, Throwable t) {
                runOnUiThread(() ->
                        Toast.makeText(HousekeeperJob.this,
                                "Lỗi khi tải chi tiết công việc: " + t.getMessage(),
                                Toast.LENGTH_SHORT).show());
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