package com.example.housekeeperapplication;

import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RatingBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ApplicantAdapter;
import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailPageDTO;
import com.example.housekeeperapplication.Model.DTOs.RatingCreateDTO;
import com.example.housekeeperapplication.Model.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobDetailActivity extends AppCompatActivity {

    private TextView tvJobName, tvVerified, tvPostedDate, tvLocation, tvSalary,
            tvDayOfWeek, tvService, tvDescription;
    private Button btnConfirmSlotWorked, btnConfirmJobCompletion;
    private LinearLayout layoutDaysContainer;
    private RecyclerView rvApplicants;
    private ApplicantAdapter applicantAdapter;
    private APIServices api;
    private int jobID;
    private ProgressBar progressBar;
    private ScrollView mainContent;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_job_detail);

        api = APIClient.getClient(this).create(APIServices.class);
        jobID = getIntent().getIntExtra("jobID", -1);

        initViews();
        showLoading();
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
        layoutDaysContainer = findViewById(R.id.layoutDaysContainer);
        progressBar = findViewById(R.id.progressBar);
        mainContent = findViewById(R.id.mainContent);

    }
    private void showLoading() {
        progressBar.setVisibility(View.VISIBLE);
        mainContent.setVisibility(View.INVISIBLE);
    }

    private void hideLoading() {
        progressBar.setVisibility(View.GONE);
        mainContent.setVisibility(View.VISIBLE);
    }
    private int getCurrentAccountId() {
        return getSharedPreferences("user_prefs", MODE_PRIVATE).getInt("accountID", -1);
    }
    private void confirmSlotWorked() {
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
        showLoading();
        if (jobDetail == null) {
            Toast.makeText(this, "Thông tin công việc chưa sẵn sàng", Toast.LENGTH_SHORT).show();
            return;
        }

        Integer bookingId = jobDetail.getBookingID();
        if (bookingId == null || bookingId == -1) {
            Toast.makeText(this, "Công việc này không có booking", Toast.LENGTH_SHORT).show();
            return;
        }

        api.ConfirmSlotWorked(bookingId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                hideLoading();
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
                hideLoading();
                Toast.makeText(JobDetailActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void confirmJobCompletion() {
        new AlertDialog.Builder(this)
                .setTitle("Xác nhận hoàn thành")
                .setMessage("Bạn có chắc muốn hoàn thành công việc này?")
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
                    Toast.makeText(JobDetailActivity.this, "Đã xác nhận hoàn thành công việc",
                            Toast.LENGTH_SHORT).show();
                    showRatingDialog();
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

    private int tempRating;
    private String tempComment;

    private void showRatingDialog() {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_rating, null);
        RatingBar ratingBar = dialogView.findViewById(R.id.ratingBar);
        EditText etComment = dialogView.findViewById(R.id.etComment);

        new AlertDialog.Builder(this)
                .setView(dialogView)
                .setPositiveButton("Gửi đánh giá", (dialog, which) -> {
                    tempRating = (int) ratingBar.getRating();
                    tempComment = etComment.getText().toString();

                    if (tempRating < 1) {
                        Toast.makeText(this, "Vui lòng chọn điểm từ 1-5 sao", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    submitRating(tempRating, tempComment);
                })
                .setNegativeButton("Bỏ qua", (dialog, which) -> finish())
                .show();
    }

    private void submitRating(int rating, String comment) {
        int housekeeperID = jobDetail.getHousekeeperID();
        api.getHousekeeperByID(housekeeperID).enqueue(new Callback<HousekeeperDetailDTO>() {
            @Override
            public void onResponse(Call<HousekeeperDetailDTO> call, Response<HousekeeperDetailDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int revieweeAccountID = response.body().getAccountID();
                    callRatingApi(getCurrentAccountId(), revieweeAccountID, comment, rating);
                } else {
                    Toast.makeText(JobDetailActivity.this,
                            "Không thể lấy thông tin người giúp việc",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<HousekeeperDetailDTO> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this,
                        "Lỗi kết nối: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }
    private void callRatingApi(int reviewerID, int revieweeID, String content, int score) {
        api.AddRating(reviewerID, revieweeID, content, score).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                try {
                    if (response.isSuccessful()) {
                        String responseBody = response.body().string();
                        Toast.makeText(JobDetailActivity.this,
                                "Đánh giá thành công: " + responseBody,
                                Toast.LENGTH_SHORT).show();
                        finish();
                    } else {
                        String error = response.errorBody().string();
                        Toast.makeText(JobDetailActivity.this,
                                "Lỗi: " + error, Toast.LENGTH_SHORT).show();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this,
                        "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    /*private void handleRatingError(Response<String> response) {
        try {
            String error = response.errorBody().string();
            if (response.code() == 404) {
                if (error.contains("Housekeeper")) {
                    Toast.makeText(this,
                            "Không tìm thấy người giúp việc",
                            Toast.LENGTH_LONG).show();
                } else if (error.contains("family")) {
                    Toast.makeText(this,
                            "Không tìm thấy thông tin gia đình",
                            Toast.LENGTH_LONG).show();
                }
            } else {
                Toast.makeText(this,
                        "Lỗi: " + error,
                        Toast.LENGTH_LONG).show();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void showRetryRatingDialog(int rating, String comment) {
        new AlertDialog.Builder(this)
                .setTitle("Gửi đánh giá thất bại")
                .setMessage("Bạn có muốn thử gửi lại đánh giá không?")
                .setPositiveButton("Thử lại", (dialog, which) -> {
                    submitRating(rating, comment);
                })
                .setNegativeButton("Để sau", (dialog, which) -> {
                    finish();
                })
                .setNeutralButton("Hủy", null)
                .show();
    }*/



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
        showLoading();
        api.getFullJobDetailByID(jobID).enqueue(new Callback<JobDetailPageDTO>() {
            @Override
            public void onResponse(Call<JobDetailPageDTO> call, Response<JobDetailPageDTO> response) {
                hideLoading();
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
                hideLoading();
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
        tvDescription.setText("Mô tả công việc: " + (job.description != null ? job.description : ""));
        // Format ngày làm việc
        if (job.dayofWeek != null) {
            for (Integer day : job.dayofWeek) {
                TextView dayTextView = new TextView(this);
                dayTextView.setText("• " + getWeekday(day));
                dayTextView.setTextSize(14);

                int padding = (int) (8 * getResources().getDisplayMetrics().density);
                dayTextView.setPadding(padding, padding, padding, padding);

                // Tạo background với bo tròn
                GradientDrawable shape = new GradientDrawable();
                shape.setShape(GradientDrawable.RECTANGLE);
                shape.setCornerRadius(16f);

                if (isToday(day)) {
                    shape.setColor(ContextCompat.getColor(this, R.color.colorPrimary));
                    dayTextView.setTextColor(ContextCompat.getColor(this, android.R.color.white));
                } else {
                    shape.setColor(ContextCompat.getColor(this, R.color.gray));
                    dayTextView.setTextColor(ContextCompat.getColor(this, R.color.white));
                }

                dayTextView.setBackground(shape);
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );
                params.setMargins(0, 0, 0, padding/2);

                layoutDaysContainer.addView(dayTextView, params);
            }
        }


        boolean showCheckInBtn = isTodayWorkDay(job.dayofWeek);
        boolean showCompletionBtn = job.status == 8;

        btnConfirmSlotWorked.setVisibility(showCheckInBtn ? View.VISIBLE : View.GONE);
        btnConfirmJobCompletion.setVisibility(showCompletionBtn ? View.VISIBLE : View.GONE);
    }



    private String getJobStatusString(int status) {
        switch (status) {
            case 1: return "🕒 Công việc đang chờ duyệt";
            case 2: return "✔️ Công việc đã xác minh";
            case 3: return "📌 Công việc đã chấp nhận";
            case 4: return "✅ Công việc đã hoàn thành";
            case 5: return "⏰ Công việc đã hết hạn";
            case 6: return "❌ Công việc đã hủy";
            case 7: return "🚫 Không được phép";
            case 8: return "👨‍👩‍👧 Công việc đang chờ xác nhận của gia đình";
            case 9: return "👨‍👩‍👧 Người giúp việc đã nghỉ";
            case 10: return "👨‍👩‍👧 Công việc đã giao lại";
            default: return "❓ Unknown";
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
        showLoading();
        api.ApplicationListByJob(jobID, pageNumber, pageSize).enqueue(new Callback<List<ApplicationDisplayDTO>>() {
            @Override
            public void onResponse(Call<List<ApplicationDisplayDTO>> call, Response<List<ApplicationDisplayDTO>> response) {
                hideLoading();
                if (response.isSuccessful() && response.body() != null) {
                    applicantAdapter.updateData(response.body());
                } else {
                    Toast.makeText(JobDetailActivity.this, "Không có ứng viên nào", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<ApplicationDisplayDTO>> call, Throwable t) {
                hideLoading();
                Toast.makeText(JobDetailActivity.this, "Lỗi tải danh sách ứng viên", Toast.LENGTH_SHORT).show();
                Log.e("Applicants", t.getMessage());
            }
        });
    }

    private String formatDate(String rawDate) {
        if (rawDate == null || !rawDate.contains("T")) return rawDate;
        return rawDate.split("T")[0];
    }
    private boolean isToday(int dayOfWeek) {
        Calendar calendar = Calendar.getInstance();
        int today = calendar.get(Calendar.DAY_OF_WEEK) - 1; // Chủ Nhật = 0
        return dayOfWeek == today;
    }
    private boolean isTodayWorkDay(List<Integer> daysOfWeek) {
        if (daysOfWeek == null) return false;

        for (int day : daysOfWeek) {
            if (isToday(day)) {
                return true;
            }
        }
        return false;
    }

}