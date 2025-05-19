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
import com.example.housekeeperapplication.Model.DTOs.BookingResponseDTO;
import com.example.housekeeperapplication.Model.DTOs.EnhancedBookingDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.io.IOException;
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
    private List<BookingResponseDTO> bookings = new ArrayList<>();
    private TextView tvEmptyList;
    private ProgressBar progressBar;
    private APIServices apiServices;
    private int currentPage = 1;
    private final int pageSize = 10;
    private boolean isLoading = false;
    private boolean isLastPage = false;

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
        if (isLoading || isLastPage) return;

        isLoading = true;
        progressBar.setVisibility(View.VISIBLE);
        tvEmptyList.setVisibility(View.GONE);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int housekeeperId = prefs.getInt("housekeeperID", -1);

        if (housekeeperId != -1) {
            apiServices.getBookingsByHousekeeperID(housekeeperId, currentPage, pageSize)
                    .enqueue(new Callback<List<BookingResponseDTO>>() {
                        @Override
                        public void onResponse(Call<List<BookingResponseDTO>> call,
                                               Response<List<BookingResponseDTO>> response) {
                            isLoading = false;
                            progressBar.setVisibility(View.GONE);

                            if (response.isSuccessful() && response.body() != null) {
                                List<BookingResponseDTO> newBookings = response.body();

                                if (newBookings.size() < pageSize) {
                                    isLastPage = true;
                                }

                                processBookingData(newBookings);
                                currentPage++;
                            } else {
                                showEmptyState();
                            }
                        }

                        @Override
                        public void onFailure(Call<List<BookingResponseDTO>> call, Throwable t) {
                            isLoading = false;
                            progressBar.setVisibility(View.GONE);
                            showError("Lỗi kết nối: " + t.getMessage());
                        }
                    });
        } else {
            progressBar.setVisibility(View.GONE);
            showError("Không tìm thấy thông tin housekeeper");
        }
    }

    private void processBookingData(List<BookingResponseDTO> bookingResponses) {
        runOnUiThread(() -> {
            Log.d("BookingDebug", "Processing data: " + (bookingResponses != null ? bookingResponses.size() : 0) + " items");

            if (bookingResponses == null || bookingResponses.isEmpty()) {
                showEmptyState();
                return;
            }

            // Clear dữ liệu cũ
            bookings.clear();

            // Thêm tất cả dữ liệu mới
            bookings.addAll(bookingResponses);

            // Cập nhật Adapter
            adapter.updateData(bookings);

            // Hiển thị RecyclerView
            rvBookings.setVisibility(View.VISIBLE);
            tvEmptyList.setVisibility(View.GONE);

            Log.d("BookingDebug", "Data updated in adapter: " + bookings.size() + " items");
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
    public void onCheckInClicked(BookingResponseDTO booking) {
        showCheckInConfirmation(booking);
    }

    @Override
    public void onCompleteJobClicked(BookingResponseDTO booking) {
        showCompleteJobConfirmation(booking);
    }



    private void showCheckInConfirmation(BookingResponseDTO booking) {
        new AlertDialog.Builder(this)
                .setTitle("Xác nhận Check-in")
                .setMessage("Bạn có chắc muốn check-in công việc này?")
                .setPositiveButton("Xác nhận", (dialog, which) -> performCheckIn(booking))
                .setNegativeButton("Hủy", null)
                .show();
    }

    private void performCheckIn(BookingResponseDTO booking) {
        progressBar.setVisibility(View.VISIBLE);

        apiServices.checkIn(booking.bookingID)
                .enqueue(new Callback<Void>() {
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> response) {
                        progressBar.setVisibility(View.GONE);
                        if (response.isSuccessful()) {
                            Toast.makeText(HousekeeperBookingActivity.this,
                                    "Check-in thành công!", Toast.LENGTH_SHORT).show();
                            refreshBookingStatus();
                        } else {
                            try {
                                String errorBody = response.errorBody() != null ?
                                        response.errorBody().string() : "Unknown error";
                                Toast.makeText(HousekeeperBookingActivity.this,
                                        "Check-in thất bại: " + errorBody, Toast.LENGTH_SHORT).show();
                            } catch (IOException e) {
                                Toast.makeText(HousekeeperBookingActivity.this,
                                        "Check-in thất bại", Toast.LENGTH_SHORT).show();
                            }
                        }
                    }

                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        progressBar.setVisibility(View.GONE);
                        Toast.makeText(HousekeeperBookingActivity.this,
                                "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void showCompleteJobConfirmation(BookingResponseDTO booking) {
        new AlertDialog.Builder(this)
                .setTitle("Xác nhận Hoàn thành")
                .setMessage("Bạn có chắc đã hoàn thành công việc này?")
                .setPositiveButton("Xác nhận", (dialog, which) -> completeJob(booking))
                .setNegativeButton("Hủy", null)
                .show();
    }

    private void completeJob(BookingResponseDTO booking) {
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);

        apiServices.completeJobByHousekeeper(booking.jobID, accountId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(HousekeeperBookingActivity.this,
                            "Đã xác nhận hoàn thành!", Toast.LENGTH_SHORT).show();
                    refreshBookingStatus();
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

    private void refreshBookingStatus() {
        currentPage = 1;
        isLastPage = false;
        bookings.clear(); // Xóa dữ liệu cũ

        // Hiển thị loading
        progressBar.setVisibility(View.VISIBLE);
        tvEmptyList.setVisibility(View.GONE);
        rvBookings.setVisibility(View.GONE);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int housekeeperId = prefs.getInt("housekeeperID", -1);

        if (housekeeperId != -1) {
            apiServices.getBookingsByHousekeeperID(housekeeperId, currentPage, pageSize)
                    .enqueue(new Callback<List<BookingResponseDTO>>() {
                        @Override
                        public void onResponse(Call<List<BookingResponseDTO>> call,
                                               Response<List<BookingResponseDTO>> response) {
                            progressBar.setVisibility(View.GONE);

                            if (response.isSuccessful() && response.body() != null
                                    && !response.body().isEmpty()) {
                                bookings.addAll(response.body());
                                adapter.updateData(bookings);
                                rvBookings.setVisibility(View.VISIBLE);
                            } else {
                                showEmptyState();
                            }
                        }

                        @Override
                        public void onFailure(Call<List<BookingResponseDTO>> call, Throwable t) {
                            progressBar.setVisibility(View.GONE);
                            showError("Lỗi kết nối: " + t.getMessage());
                        }
                    });
        }
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

    private String formatPrice(double price) {
        return String.format(Locale.getDefault(), "%,.0f VND", price);
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