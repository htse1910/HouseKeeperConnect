package com.example.housekeeperapplication;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.Model.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobHousekeeperDetailActivity extends AppCompatActivity {

    private TextView tvJobTitle, tvFamily, tvLocation, tvSalary, tvStartDate, tvEndDate;
    private TextView tvServices, tvSchedules, tvSlots, tvWorkType, tvDescription;
    private APIServices apiService;
    private int jobID;

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
                    bindJobDetail(jobDetail);
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

    private void bindJobDetail(JobDetailForBookingDTO jobDetail) {
        tvJobTitle.setText(jobDetail.getJobName());
        tvFamily.setText("Gia đình: " + jobDetail.getFamilyID());
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
        tvWorkType.setText(jobDetail.getJobType() == 1 ? "Full-time" : "Part-time");

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
