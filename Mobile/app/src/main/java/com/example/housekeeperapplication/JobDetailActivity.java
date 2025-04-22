package com.example.housekeeperapplication;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailPageDTO;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobDetailActivity extends AppCompatActivity {

    TextView tvJobName, tvLocation, tvSalary, tvStartDate, tvEndDate,
            tvDescription, tvDayOfWeek, tvSlot, tvServices, tvHousekeeperName;
    ImageView imgHousekeeper;
    Button btnConfirmSlotWorked, btnConfirmJobCompletion;
    private JobDetailPageDTO jobDetail;

    APIServices api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_job_detail);

        api = APIClient.getClient(this).create(APIServices.class);
        int jobID = getIntent().getIntExtra("jobID", -1);

        tvJobName = findViewById(R.id.tvJobName);
        tvLocation = findViewById(R.id.tvLocation);
        tvSalary = findViewById(R.id.tvSalary);
        tvStartDate = findViewById(R.id.tvStartDate);
        tvEndDate = findViewById(R.id.tvEndDate);
        tvDescription = findViewById(R.id.tvDescription);
        tvDayOfWeek = findViewById(R.id.tvDayOfWeek);
        tvSlot = findViewById(R.id.tvSlot);
        tvServices = findViewById(R.id.tvServices);
        tvHousekeeperName = findViewById(R.id.tvHousekeeperName);
        imgHousekeeper = findViewById(R.id.imgHousekeeper);
        btnConfirmSlotWorked = findViewById(R.id.btnConfirmSlotWorked);
        btnConfirmJobCompletion = findViewById(R.id.btnConfirmJobCompletion);

        btnConfirmSlotWorked.setOnClickListener(v -> {
            if (jobDetail != null && jobDetail.bookingID > 0) {
                confirmSlotWorked(jobDetail.bookingID);
            } else {
                Toast.makeText(this, "Không có thông tin bookingID", Toast.LENGTH_SHORT).show();
            }
        });

        btnConfirmJobCompletion.setOnClickListener(v -> {
            SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
            int accountId = prefs.getInt("accountID", -1);
            if (jobDetail != null && jobDetail.jobID > 0 && accountId > 0) {
                confirmJobCompletion(jobDetail.jobID, accountId);
            } else {
                Toast.makeText(this, "Thiếu thông tin để xác nhận hoàn thành", Toast.LENGTH_SHORT).show();
            }
        });


        if (jobID != -1) {
            loadJobDetail(jobID);
        } else {
            Toast.makeText(this, "Job ID không hợp lệ", Toast.LENGTH_SHORT).show();
        }
    }
    private void confirmJobCompletion(int jobID, int accountID) {
        api.confirmJobCompletion(jobID, accountID).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                Toast.makeText(JobDetailActivity.this,
                        response.isSuccessful() ? "🎉 Công việc đã hoàn thành!" : "❌ Xác nhận thất bại",
                        Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this, "⚠️ Lỗi kết nối", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void loadJobDetail(int jobID) {
        api.getFullJobDetailByID(jobID).enqueue(new Callback<JobDetailPageDTO>() {
            @Override
            public void onResponse(Call<JobDetailPageDTO> call, Response<JobDetailPageDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JobDetailPageDTO job = response.body();

                    tvJobName.setText("🧽 " + job.jobName);
                    tvLocation.setText("📍 Địa điểm: " + job.location);
                    tvSalary.setText("💵 Lương: " + job.price + " VND");
                    tvStartDate.setText("📅 Bắt đầu: " + formatDate(job.startDate));
                    tvEndDate.setText("📅 Kết thúc: " + formatDate(job.endDate));
                    tvDescription.setText("📝 Mô tả: " + job.description);
                    tvDayOfWeek.setText("📆 Thứ: " + getWeekday(job.dayofWeek));
                    tvSlot.setText("🕐 Ca: " + getSlot(job.slotIDs));
                    tvServices.setText("🛎️ Dịch vụ: " + getService(job.serviceIDs));

                    jobDetail = job;

                    loadHousekeeper(job.housekeeperID);
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

    private void loadHousekeeper(int housekeeperID) {
        api.getHousekeeperByID(housekeeperID).enqueue(new Callback<HousekeeperDetailDTO>() {
            @Override
            public void onResponse(Call<HousekeeperDetailDTO> call, Response<HousekeeperDetailDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    HousekeeperDetailDTO hk = response.body();
                    tvHousekeeperName.setText("👤 " + hk.name);

                    Glide.with(JobDetailActivity.this)
                            .load(hk.googleProfilePicture)
                            .placeholder(R.drawable.ic_launcher_background)
                            .into(imgHousekeeper);
                } else {
                    tvHousekeeperName.setText("👤 [Không rõ]");
                }
            }

            @Override
            public void onFailure(Call<HousekeeperDetailDTO> call, Throwable t) {
                tvHousekeeperName.setText("👤 [Không rõ]");
            }
        });
    }
    private void confirmSlotWorked(int bookingID) {
        api.confirmSlotWorked(bookingID).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(JobDetailActivity.this, "✅ Xác nhận thành công!", Toast.LENGTH_SHORT).show();
                    btnConfirmSlotWorked.setEnabled(false);
                    btnConfirmSlotWorked.setText("Đã xác nhận");
                } else {
                    Toast.makeText(JobDetailActivity.this, "❌ Xác nhận thất bại", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(JobDetailActivity.this, "⚠️ Lỗi kết nối", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private String formatDate(String rawDate) {
        if (rawDate == null || !rawDate.contains("T")) return rawDate;
        return rawDate.split("T")[0];
    }

    private String getWeekday(java.util.List<Integer> list) {
        if (list == null || list.isEmpty()) return "[Không rõ]";
        switch (list.get(0)) {
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

    private String getSlot(java.util.List<Integer> list) {
        if (list == null || list.isEmpty()) return "[Không rõ]";
        switch (list.get(0)) {
            case 1: return "8H - 9H";
            case 2: return "9H - 10H";
            case 3: return "10H - 11H";
            case 4: return "11H - 12H";
            case 5: return "12H - 13H";
            case 6: return "13H - 14H";
            case 7: return "14H - 15H";
            case 8: return "15H - 16H";
            case 9: return "16H - 17H";
            case 10: return "17H - 18H";
            case 11: return "18H - 19H";
            case 12: return "19H - 20H";
            default: return "Ca #" + list.get(0);
        }
    }

    private String getService(java.util.List<Integer> list) {
        if (list == null || list.isEmpty()) return "[Không rõ]";
        switch (list.get(0)) {
            case 1: return "Dọn dẹp";
            case 2: return "Tổng vệ sinh";
            case 3: return "Dọn dẹp theo giờ";
            case 4: return "Giữ trẻ tại nhà";
            case 5: return "Chăm sóc người già";
            case 6: return "Nấu ăn theo yêu cầu";
            case 7: return "Nấu ăn theo giờ";
            case 8: return "Giặt ủi";
            case 9: return "Ủi quần áo";
            case 10: return "Giặt hấp";
            case 11: return "Chăm sóc thú cưng";
            case 12: return "Tưới cây, chăm cây";
            case 13: return "Tắm & cắt lông thú";
            case 14: return "Sửa chữa điện nước";
            case 15: return "Sơn sửa đồ đạc";
            case 16: return "Thợ sửa chuyên nghiệp";
            case 17: return "Giúp việc theo tháng";
            case 18: return "Hỗ trợ vận chuyển";
            default: return "Dịch vụ #" + list.get(0);
        }
    }
}
