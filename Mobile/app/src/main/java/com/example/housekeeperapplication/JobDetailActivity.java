package com.example.housekeeperapplication;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ApplicantAdapter;
import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailPageDTO;
import com.example.housekeeperapplication.Model.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobDetailActivity extends AppCompatActivity {

    private TextView tvJobName, tvVerified, tvPostedDate, tvLocation, tvSalary,
            tvDayOfWeek, tvService, tvDescription, tvBookingId;
    private Button btnConfirmSlotWorked, btnConfirmJobCompletion;
    private RecyclerView rvApplicants;
    private ApplicantAdapter applicantAdapter;
    private APIServices api;
    private int jobID;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_job_detail);

        api = APIClient.getClient(this).create(APIServices.class);
        jobID = getIntent().getIntExtra("jobID", -1);

        initViews();
        setupApplicantsRecyclerView();

        if (jobID != -1) {
            loadJobDetail(jobID);
            loadApplicants(jobID, 1, 10); // Page 1, 10 items per page
        } else {
            Toast.makeText(this, "Job ID không hợp lệ", Toast.LENGTH_SHORT).show();
            finish();
        }
        btnConfirmSlotWorked.setOnClickListener(v -> confirmSlotWorked());
        btnConfirmJobCompletion.setOnClickListener(v -> confirmJobCompletion());
    }
    private void confirmSlotWorked() {
        // Show confirmation dialog
        new AlertDialog.Builder(this)
                .setTitle("Xác nhận Check-In")
                .setMessage("Bạn có chắc chắn muốn xác nhận người giúp việc đã check-in hôm nay?")
                .setPositiveButton("Xác nhận", (dialog, which) -> {
                    callConfirmSlotWorkedAPI();
                })
                .setNegativeButton("Hủy", null)
                .show();
    }

    private void callConfirmSlotWorkedAPI() {
        if (jobDetail == null) {
            Toast.makeText(this, "Thông tin công việc chưa sẵn sàng", Toast.LENGTH_SHORT).show();
            return;
        }

        // Lấy bookingId từ jobDetail
        Integer bookingId = jobDetail.getBookingID();
        if (bookingId == null || bookingId == -1) {
            Toast.makeText(this, "Công việc này không có booking", Toast.LENGTH_SHORT).show();
            return;
        }

        api.ConfirmSlotWorked(bookingId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(JobDetailActivity.this, "Đã xác nhận check-in thành công", Toast.LENGTH_SHORT).show();
                } else {
                    try {
                        String errorBody = response.errorBody().string();
                        Toast.makeText(JobDetailActivity.this, "Lỗi: " + errorBody, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        Toast.makeText(JobDetailActivity.this, "Lỗi khi xác nhận check-in", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void confirmJobCompletion() {
        // Show confirmation dialog
        new AlertDialog.Builder(this)
                .setTitle("Xác nhận hoàn thành công việc")
                .setMessage("Bạn có chắc chắn muốn xác nhận hoàn thành công việc này?")
                .setPositiveButton("Xác nhận", (dialog, which) -> {
                    callConfirmJobCompletionAPI();
                })
                .setNegativeButton("Hủy", null)
                .show();
    }

    private void callConfirmJobCompletionAPI() {
        int jobId = getIntent().getIntExtra("jobID", -1);
        if (jobId == -1) {
            Toast.makeText(this, "Không tìm thấy thông tin công việc", Toast.LENGTH_SHORT).show();
            return;
        }

        // Get account ID from shared preferences or wherever you store it
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);
        if (accountId == -1) {
            Toast.makeText(this, "Vui lòng đăng nhập lại", Toast.LENGTH_SHORT).show();
            return;
        }

        api.ConfirmJobCompletion(jobId, accountId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(JobDetailActivity.this, "Đã xác nhận hoàn thành công việc", Toast.LENGTH_SHORT).show();
                    // Optionally update UI or finish activity
                    finish();
                } else {
                    try {
                        String errorBody = response.errorBody().string();
                        Toast.makeText(JobDetailActivity.this, "Lỗi: " + errorBody, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        Toast.makeText(JobDetailActivity.this, "Lỗi khi xác nhận hoàn thành", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void initViews() {
        tvJobName = findViewById(R.id.tvJobName);
        tvVerified = findViewById(R.id.tvVerified);
        tvPostedDate = findViewById(R.id.tvPostedDate);
        tvLocation = findViewById(R.id.tvLocation);
        tvSalary = findViewById(R.id.tvSalary);
        tvDayOfWeek = findViewById(R.id.tvDayOfWeek);
        tvService = findViewById(R.id.tvService);
        tvDescription = findViewById(R.id.tvDescription);
        btnConfirmSlotWorked = findViewById(R.id.btnConfirmSlotWorked);
        btnConfirmJobCompletion = findViewById(R.id.btnConfirmJobCompletion);
        rvApplicants = findViewById(R.id.rvApplicants);
        tvBookingId =findViewById(R.id.tvBookingID);
    }

    private void setupApplicantsRecyclerView() {
        applicantAdapter = new ApplicantAdapter(new ArrayList<>(), new ApplicantAdapter.ApplicantClickListener() {
            @Override
            public void onItemClick(ApplicationDisplayDTO applicant) {
                Intent intent = new Intent(JobDetailActivity.this, ReviewProflieHousekeeperActivity.class);
                intent.putExtra("applicantID", applicant.getHousekeeperID());
                startActivity(intent);
            }
            @Override
            public void onAcceptClick(ApplicationDisplayDTO applicant, int position) {
            }

            @Override
            public void onRejectClick(ApplicationDisplayDTO applicant, int position) {
            }
        }, this);

        rvApplicants.setLayoutManager(new LinearLayoutManager(this));
        rvApplicants.setAdapter(applicantAdapter);

        // Thêm divider giữa các item (tuỳ chọn)
        rvApplicants.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
    }
    private JobDetailPageDTO jobDetail;
    private void loadJobDetail(int jobID) {
        api.getFullJobDetailByID(jobID).enqueue(new Callback<JobDetailPageDTO>() {
            @Override
            public void onResponse(Call<JobDetailPageDTO> call, Response<JobDetailPageDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    jobDetail = response.body(); // Lưu lại dữ liệu
                    updateJobDetailUI(response.body());

                    // Log để kiểm tra
                    Log.d("JobDetail", "BookingID: " + jobDetail.getBookingID());

                    if (response.body().serviceIDs != null && !response.body().serviceIDs.isEmpty()) {
                        loadService(response.body().serviceIDs.get(0));
                    }
                } else {
                    Toast.makeText(JobDetailActivity.this, "Không tải được chi tiết công việc", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<JobDetailPageDTO> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("JobDetail", t.getMessage());
            }
        });
    }

    private void updateJobDetailUI(JobDetailPageDTO job) {
        tvJobName.setText(job.jobName != null ? job.jobName : "");
        tvVerified.setText(getJobStatusString(job.status));
        tvPostedDate.setText("📅 Đăng vào: " + formatDate(job.startDate));
        tvLocation.setText("📍 " + (job.location != null ? job.location : ""));
        tvSalary.setText("Mức lương: " + String.format("%,d", job.price) + " VNĐ");

        // Format ngày làm việc
        StringBuilder daysText = new StringBuilder();
        if (job.dayofWeek != null) {
            for (Integer day : job.dayofWeek) {
                daysText.append("• ").append(getWeekday(day)).append("\n");
            }
        }
        tvDayOfWeek.setText(daysText.toString().trim());
        tvDescription.setText("Mô tả công việc: " + (job.description != null ? job.description : ""));
    }

    private String getJobStatusString(int status) {
        switch (status) {
            case 1: return "🕒 Đang chờ";
            case 2: return "✔️ Đã xác minh";
            case 3: return "📌 Đã chấp nhận";
            case 4: return "✅ Hoàn thành";
            case 5: return "⏰ Hết hạn";
            case 6: return "❌ Đã hủy";
            default: return "❓ Trạng thái không xác định";
        }
    }

    private String getWeekday(int day) {
        switch (day) {
            case 0: return "Chủ Nhật";
            case 1: return "Thứ Hai";
            case 2: return "Thứ Ba";
            case 3: return "Thứ Tư";
            case 4: return "Thứ Năm";
            case 5: return "Thứ Sáu";
            case 6: return "Thứ Bảy";
            default: return "Thứ ?";
        }
    }

    private void loadService(int serviceID) {
        api.getServiceByID(serviceID).enqueue(new Callback<Service>() {
            @Override
            public void onResponse(Call<Service> call, Response<Service> response) {
                if (response.isSuccessful() && response.body() != null) {
                    tvService.setText(response.body().getServiceName());
                }
            }

            @Override
            public void onFailure(Call<Service> call, Throwable t) {
                Log.e("Service", "Failed to load service name", t);
            }
        });
    }

    private void loadApplicants(int jobID, int pageNumber, int pageSize) {
        api.ApplicationListByJob(jobID, pageNumber, pageSize).enqueue(new Callback<List<ApplicationDisplayDTO>>() {
            @Override
            public void onResponse(Call<List<ApplicationDisplayDTO>> call, Response<List<ApplicationDisplayDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    applicantAdapter.updateData(response.body());
                } else {
                    Toast.makeText(JobDetailActivity.this, "Không có ứng viên nào", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<ApplicationDisplayDTO>> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this, "Lỗi tải danh sách ứng viên", Toast.LENGTH_SHORT).show();
                Log.e("Applicants", t.getMessage());
            }
        });
    }

    private String formatDate(String rawDate) {
        if (rawDate == null || !rawDate.contains("T")) return rawDate;
        return rawDate.split("T")[0];
    }
}