package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.EnhancedBookingAdapter;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.BookingHousekeeperDTO;
import com.example.housekeeperapplication.Model.DTOs.EnhancedBookingDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HousekeeperBookingActivity extends AppCompatActivity
        implements EnhancedBookingAdapter.OnBookingActionListener {

    private RecyclerView rvBookings;
    private EnhancedBookingAdapter adapter;
    private List<EnhancedBookingDTO> bookings = new ArrayList<>();
    private TextView tvEmptyList;
    private ProgressBar progressBar;
    private APIServices apiServices;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.housekeeper_booking_management);

        initializeViews();
        setupAdapter();
        setupBottomNavigation();
        loadBookings();
    }

    private void initializeViews() {
        rvBookings = findViewById(R.id.rvBookings);
        tvEmptyList = findViewById(R.id.tvEmptyList);
        progressBar = findViewById(R.id.progressBar);

        apiServices = APIClient.getClient(this).create(APIServices.class);

        rvBookings.setLayoutManager(new LinearLayoutManager(this));
        rvBookings.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
    }

    private void setupAdapter() {
        adapter = new EnhancedBookingAdapter(this, bookings, this);
        rvBookings.setAdapter(adapter);
    }



    private void loadBookings() {
        progressBar.setVisibility(View.VISIBLE);
        tvEmptyList.setVisibility(View.GONE);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int housekeeperId = prefs.getInt("housekeeperID", -1);

        if (housekeeperId != -1) {
            apiServices.getBookingsByHousekeeperID(housekeeperId).enqueue(new Callback<List<JobDetailForBookingDTO>>() {
                @Override
                public void onResponse(Call<List<JobDetailForBookingDTO>> call, Response<List<JobDetailForBookingDTO>> response) {
                    progressBar.setVisibility(View.GONE);

                    if (response.isSuccessful() && response.body() != null) {
                        processBookingData(response.body());
                    } else {
                        showEmptyState();
                    }
                }

                @Override
                public void onFailure(Call<List<JobDetailForBookingDTO>> call, Throwable t) {
                    progressBar.setVisibility(View.GONE);
                    showError("Lỗi kết nối: " + t.getMessage());
                }
            });
        } else {
            progressBar.setVisibility(View.GONE);
            showError("Không tìm thấy thông tin housekeeper");
        }
    }

    private void processBookingData(List<JobDetailForBookingDTO> jobDetails) {
        bookings.clear();

        if (jobDetails.isEmpty()) {
            showEmptyState();
            return;
        }

        for (JobDetailForBookingDTO jobDetail : jobDetails) {
            EnhancedBookingDTO booking = convertToEnhancedDTO(jobDetail);
            bookings.add(booking);

            // Load additional info if needed
            if (jobDetail.familyID > 0) {
                loadFamilyInfo(booking, jobDetail.familyID);
            }
        }

        adapter.updateData(bookings);
        rvBookings.setVisibility(View.VISIBLE);
        tvEmptyList.setVisibility(View.GONE);
    }

    private EnhancedBookingDTO convertToEnhancedDTO(JobDetailForBookingDTO jobDetail) {
        EnhancedBookingDTO booking = new EnhancedBookingDTO();
        booking.bookingID = jobDetail.bookingID != null ? jobDetail.bookingID : 0;
        booking.jobID = jobDetail.jobID;
        booking.status = jobDetail.status;
        booking.jobName = jobDetail.jobName;
        booking.location = jobDetail.location;
        booking.price = jobDetail.price;
        booking.startDate = jobDetail.startDate;
        booking.endDate = jobDetail.endDate;
        booking.description = jobDetail.description;
        booking.serviceIDs = jobDetail.serviceIDs;
        booking.slotIDs = jobDetail.slotIDs;
        booking.dayofWeek = jobDetail.dayofWeek;
        return booking;
    }

    private void loadFamilyInfo(EnhancedBookingDTO booking, int familyId) {
        apiServices.getFamilyByID(familyId).enqueue(new Callback<FamilyAccountMappingDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountMappingDTO> call, Response<FamilyAccountMappingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    booking.familyName = response.body().name;
                    adapter.notifyItemChanged(bookings.indexOf(booking));

                    // Load account info for profile picture
                    if (response.body().accountID > 0) {
                        loadAccountInfo(booking, response.body().accountID);
                    }
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                Log.e("FamilyInfo", "Error loading family info", t);
            }
        });
    }

    private void loadAccountInfo(EnhancedBookingDTO booking, int accountId) {
        apiServices.getAccountById(accountId).enqueue(new Callback<Account>() {
            @Override
            public void onResponse(Call<Account> call, Response<Account> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Account account = response.body();
                    booking.familyProfilePicture = account.getGoogleProfilePicture() != null ?
                            account.getGoogleProfilePicture() : account.getLocalProfilePicture();
                    adapter.notifyItemChanged(bookings.indexOf(booking));
                }
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                Log.e("AccountInfo", "Error loading account info", t);
            }
        });
    }

    private void showEmptyState() {
        rvBookings.setVisibility(View.GONE);
        tvEmptyList.setVisibility(View.VISIBLE);
        tvEmptyList.setText("Không có công việc nào được đặt");
    }

    private void showError(String message) {
        rvBookings.setVisibility(View.GONE);
        tvEmptyList.setVisibility(View.VISIBLE);
        tvEmptyList.setText(message);
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }

    // Implement interface methods
    @Override
    public void onBookingClicked(EnhancedBookingDTO booking) {
        showBookingDetailDialog(booking);
    }

    @Override
    public void onCheckInClicked(EnhancedBookingDTO booking) {
        showCheckInConfirmation(booking);
    }

    @Override
    public void onCompleteJobClicked(EnhancedBookingDTO booking) {
        showCompleteJobConfirmation(booking);
    }

    private void showBookingDetailDialog(EnhancedBookingDTO booking) {
        new AlertDialog.Builder(this)
                .setTitle(booking.jobName)
                .setMessage(formatBookingDetails(booking))
                .setPositiveButton("Đóng", null)
                .show();
    }

    private String formatBookingDetails(EnhancedBookingDTO booking) {
        return "Mã đặt: #" + booking.bookingID + "\n\n" +
                "Gia đình: " + (booking.familyName != null ? booking.familyName : "Chưa rõ") + "\n" +
                "Địa điểm: " + booking.location + "\n\n" +
                "Thời gian: " + formatDate(booking.startDate) + " - " + formatDate(booking.endDate) + "\n" +
                "Mô tả: " + booking.description + "\n\n" +
                "Trạng thái: " + getStatusText(booking.status);
    }

    private void showCheckInConfirmation(EnhancedBookingDTO booking) {
        new AlertDialog.Builder(this)
                .setTitle("Xác nhận Check-In")
                .setMessage("Bạn có chắc muốn check-in công việc này?")
                .setPositiveButton("Check-In", (dialog, which) -> {
                    performCheckIn(booking);
                })
                .setNegativeButton("Hủy", null)
                .show();
    }

    private void performCheckIn(EnhancedBookingDTO booking) {
        apiServices.checkIn(booking.bookingID).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(HousekeeperBookingActivity.this,
                            "Check-In thành công!", Toast.LENGTH_SHORT).show();
                    refreshBookingStatus(booking);
                } else {
                    Toast.makeText(HousekeeperBookingActivity.this,
                            "Check-In thất bại", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(HousekeeperBookingActivity.this,
                        "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showCompleteJobConfirmation(EnhancedBookingDTO booking) {
        new AlertDialog.Builder(this)
                .setTitle("Xác nhận Hoàn thành")
                .setMessage("Bạn có chắc đã hoàn thành công việc này?")
                .setPositiveButton("Xác nhận", (dialog, which) -> {
                    completeJob(booking);
                })
                .setNegativeButton("Hủy", null)
                .show();
    }

    private void completeJob(EnhancedBookingDTO booking) {
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);

        apiServices.completeJobByHousekeeper(booking.jobID, accountId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(HousekeeperBookingActivity.this,
                            "Đã xác nhận hoàn thành!", Toast.LENGTH_SHORT).show();
                    refreshBookingStatus(booking);
                } else {
                    Toast.makeText(HousekeeperBookingActivity.this,
                            "Xác nhận thất bại", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(HousekeeperBookingActivity.this,
                        "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void refreshBookingStatus(EnhancedBookingDTO booking) {
        apiServices.getJobDetailByID(booking.jobID).enqueue(new Callback<JobDetailForBookingDTO>() {
            @Override
            public void onResponse(Call<JobDetailForBookingDTO> call, Response<JobDetailForBookingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int position = bookings.indexOf(booking);
                    if (position != -1) {
                        booking.status = response.body().status;
                        adapter.notifyItemChanged(position);
                    }
                }
            }

            @Override
            public void onFailure(Call<JobDetailForBookingDTO> call, Throwable t) {
                Log.e("RefreshStatus", "Error refreshing status", t);
            }
        });
    }

    private String getStatusText(int status) {
        switch (status) {
            case 1: return "Đang chờ xác nhận";
            case 2: return "Đã xác nhận";
            case 3: return "Đang thực hiện";
            case 4: return "Đã hoàn thành";
            case 5: return "Đã đánh giá";
            case 6: return "Đã hủy";
            default: return "Trạng thái không xác định";
        }
    }

    private String formatDate(String rawDate) {
        if (rawDate == null) return "Chưa xác định";
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            Date date = inputFormat.parse(rawDate);
            return outputFormat.format(date);
        } catch (Exception e) {
            return rawDate.split("T")[0];
        }
    }

    private void setupBottomNavigation() {
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_activity);

        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                startActivity(new Intent(this, getHomeActivityClass()));
                return true;
            } else if (itemId == R.id.nav_activity) {
                return true;
            } else if (itemId == R.id.nav_notification) {
                startActivity(new Intent(this, NotificationActivity.class));
                return true;
            } else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatListMockActivity.class));
                return true;
            } else if (itemId == R.id.nav_profile) {
                startActivity(new Intent(this, getProfileActivityClass()));
                return true;
            }
            return false;
        });
    }

    private Class<?> getHomeActivityClass() {
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        return prefs.getInt("roleID", 0) == 1 ?
                HomeHousekeeperActivity.class : HomeActivity.class;
    }

    private Class<?> getProfileActivityClass() {
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        return prefs.getInt("roleID", 0) == 1 ?
                HousekeeperProfile.class : FamilyProfile.class;
    }
}
