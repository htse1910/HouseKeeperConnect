package com.example.housekeeperapplication;

import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.Model.Service;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobHousekeeperDetailActivity extends AppCompatActivity {

    private TextView tvJobTitle, tvFamily, tvLocation, tvSalary, tvStartDate, tvEndDate;
    private TextView tvServices, tvSchedules, tvSlots, tvWorkType, tvDescription;
    private APIServices apiService;
    private int jobID;
    private int familyID;
    private Button btnApply;
    private Button btnMessage;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_job_housekeeper_detail);

        initViews();
        apiService = APIClient.getClient(this).create(APIServices.class);

        // Lấy jobID từ Intent
        jobID = getIntent().getIntExtra("jobID", -1);

        if (jobID != -1) {
            loadJobDetail(jobID);
        } else {
            Toast.makeText(this, "Không tìm thấy công việc", Toast.LENGTH_SHORT).show();
            finish();
        }
        btnApply = findViewById(R.id.btnApply);
        btnMessage = findViewById(R.id.btnMessage);
        btnMessage.setOnClickListener(v -> {
            Intent intent = new Intent(JobHousekeeperDetailActivity.this, ChatListMockActivity.class);
            startActivity(intent);
        });
        btnApply.setOnClickListener(v -> applyForJob());
    }
    private void applyForJob() {
        // Lấy accountID từ SharedPreferences hoặc nơi bạn lưu thông tin người dùng
        SharedPreferences sharedPreferences = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountID = sharedPreferences.getInt("accountID", -1);

        if (accountID == -1) {
            Toast.makeText(this, "Vui lòng đăng nhập để ứng tuyển", Toast.LENGTH_SHORT).show();
            // Chuyển về màn hình đăng nhập
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        if (jobID == -1) {
            Toast.makeText(this, "Không tìm thấy công việc", Toast.LENGTH_SHORT).show();
            return;
        }

        // Hiển thị dialog loading
        ProgressDialog progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("Đang gửi đơn ứng tuyển...");
        progressDialog.setCancelable(false);
        progressDialog.show();

        Call<ResponseBody> call = apiService.addApplication(accountID, jobID);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                progressDialog.dismiss();

                if (response.isSuccessful()) {
                    Toast.makeText(JobHousekeeperDetailActivity.this, "Ứng tuyển thành công!", Toast.LENGTH_SHORT).show();
                    finish(); // Đóng activity sau khi ứng tuyển thành công
                } else {
                    try {
                        String errorMessage = response.errorBody().string();
                        Toast.makeText(JobHousekeeperDetailActivity.this, errorMessage, Toast.LENGTH_LONG).show();
                    } catch (IOException e) {
                        Toast.makeText(JobHousekeeperDetailActivity.this, "Lỗi khi ứng tuyển", Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                progressDialog.dismiss();
                Toast.makeText(JobHousekeeperDetailActivity.this, "Lỗi mạng: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("APPLY_ERROR", t.getMessage(), t);
            }
        });
    }

    private void initViews() {
        tvJobTitle = findViewById(R.id.tvJobTitle);
        tvFamily = findViewById(R.id.tvFamily);
        tvLocation = findViewById(R.id.tvLocation);
        tvSalary = findViewById(R.id.tvSalary);
        tvStartDate = findViewById(R.id.tvStartDate);
        tvEndDate = findViewById(R.id.tvEndDate);
        tvServices = findViewById(R.id.tvServices);
        tvSchedules = findViewById(R.id.tvSchedules);
        tvSlots = findViewById(R.id.tvSlots);
        tvWorkType = findViewById(R.id.tvWorkType);
        tvDescription = findViewById(R.id.tvDescription);
    }

    private void loadJobDetail(int jobID) {
        Call<JobDetailForBookingDTO> call = apiService.getJobDetailByID(jobID);
        call.enqueue(new Callback<JobDetailForBookingDTO>() {
            @Override
            public void onResponse(Call<JobDetailForBookingDTO> call, Response<JobDetailForBookingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JobDetailForBookingDTO jobDetail = response.body();
                    familyID = jobDetail.getFamilyID();
                    bindJobDetail(jobDetail);
                    fetchFamilyName(familyID);
                } else {
                    Toast.makeText(JobHousekeeperDetailActivity.this, "Không thể tải chi tiết công việc", Toast.LENGTH_SHORT).show();
                    Log.e("API_ERROR", "Response: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<JobDetailForBookingDTO> call, Throwable t) {
                Toast.makeText(JobHousekeeperDetailActivity.this, "Lỗi mạng: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("NETWORK_ERROR", t.getMessage(), t);
            }
        });
    }
    private void fetchFamilyName(int familyID) {
        // First set loading text
        tvFamily.setText("Đang tải thông tin gia đình...");

        // First get the family to get accountID
        apiService.getFamilyByID(familyID).enqueue(new Callback<FamilyAccountMappingDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountMappingDTO> call,
                                   Response<FamilyAccountMappingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int accountID = response.body().getAccountID();

                    // Now get the family details with account info
                    apiService.getFamilyByAccountID(accountID).enqueue(new Callback<FamilyAccountDetailDTO>() {
                        @Override
                        public void onResponse(Call<FamilyAccountDetailDTO> call,
                                               Response<FamilyAccountDetailDTO> response) {
                            if (response.isSuccessful() && response.body() != null) {
                                String name = response.body().getName();
                                tvFamily.setText("Gia đình: " + name);
                            } else {
                                tvFamily.setText("Gia đình: Không xác định");
                                Log.e("API_ERROR", "Error getting family details: " + response.message());
                            }
                        }

                        @Override
                        public void onFailure(Call<FamilyAccountDetailDTO> call, Throwable t) {
                            tvFamily.setText("Gia đình: Không xác định");
                            Log.e("NETWORK_ERROR", "Failed to get family details", t);
                        }
                    });
                } else {
                    tvFamily.setText("Gia đình: Không xác định");
                    Log.e("API_ERROR", "Error getting family: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                tvFamily.setText("Gia đình: Không xác định");
                Log.e("NETWORK_ERROR", "Failed to get family", t);
            }
        });
    }

    private void bindJobDetail(JobDetailForBookingDTO jobDetail) {
        tvJobTitle.setText(jobDetail.getJobName());

        tvLocation.setText(jobDetail.getLocation());
        tvSalary.setText(String.format("%,.0f VND", jobDetail.getPrice()));
        tvDescription.setText(jobDetail.getDescription());

        String startDate = formatDate(jobDetail.getStartDate());
        String endDate = formatDate(jobDetail.getEndDate());
        tvStartDate.setText("Từ: " + startDate);
        tvEndDate.setText("Đến: " + endDate);

        // Hiển thị lịch làm việc
        tvSchedules.setText(formatDays(jobDetail.getDayofWeek()));
        tvSlots.setText(formatSlots(jobDetail.getSlotIDs()));

        // Hiển thị loại hình làm việc (jobType)
        tvWorkType.setText(jobDetail.getJobType() == 1 ? "Ngắn hạn" : "Định kỳ");

        // Load dịch vụ
        loadServices(jobDetail.getServiceIDs());
    }
    private String formatDate(String dateString) {
        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy");
        try {
            Date date = inputFormat.parse(dateString);
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return dateString;  // Trả lại ngày gốc nếu không chuyển đổi được
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

    private void loadServices(List<Integer> serviceIDs) {
        StringBuilder servicesText = new StringBuilder();
        for (Integer serviceID : serviceIDs) {
            Call<Service> serviceCall = apiService.getServiceByID(serviceID);
            serviceCall.enqueue(new Callback<Service>() {
                @Override
                public void onResponse(Call<Service> call, Response<Service> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        Service service = response.body();
                        servicesText.append("- ").append(service.getServiceName()).append("\n");
                        tvServices.setText(servicesText.toString());
                    } else {
                        Log.e("SERVICE_ERROR", "Không thể lấy dịch vụ ID: " + serviceID);
                    }
                }

                @Override
                public void onFailure(Call<Service> call, Throwable t) {
                    Log.e("NETWORK_ERROR", "Lỗi dịch vụ: " + t.getMessage());
                }
            });
        }
    }
}
