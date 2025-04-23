package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.BookingAdapter;
import com.example.housekeeperapplication.Model.DTOs.BookingHousekeeperDTO;
import com.example.housekeeperapplication.R;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HousekeeperBookingActivity extends AppCompatActivity {

    RecyclerView rvBookings;
    BookingAdapter bookingAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.housekeeper_booking_management);

        rvBookings = findViewById(R.id.rvBookings);
        rvBookings.setLayoutManager(new LinearLayoutManager(this));

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int housekeeperId = prefs.getInt("housekeeperID", -1);

        if (housekeeperId != -1) {
            APIServices api = APIClient.getClient(this).create(APIServices.class);
            Call<List<BookingHousekeeperDTO>> call = api.getBookingsByHousekeeperID(housekeeperId);

            call.enqueue(new Callback<List<BookingHousekeeperDTO>>() {
                @Override
                public void onResponse(Call<List<BookingHousekeeperDTO>> call, Response<List<BookingHousekeeperDTO>> response) {
                    if (response.isSuccessful()) {
                        List<BookingHousekeeperDTO> bookings = response.body();
                        bookingAdapter = new BookingAdapter(HousekeeperBookingActivity.this, bookings, booking -> {
                            showCheckInDialog(booking);
                        });
                        rvBookings.setAdapter(bookingAdapter);
                    } else {
                        Toast.makeText(HousekeeperBookingActivity.this, "Không tải được dữ liệu", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<List<BookingHousekeeperDTO>> call, Throwable t) {
                    Toast.makeText(HousekeeperBookingActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_home);
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                startActivity(new Intent(this, HomeHousekeeperActivity.class));
                return true;
            } else if (itemId == R.id.nav_activity) {
                return true;
            } else if (itemId == R.id.nav_notification) {
                startActivity(new Intent(this, NotificationActivity.class));
                return true; // Đang ở trang thông báo
            /*} else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatActivity.class));
                return true;*/
            } else if (itemId == R.id.nav_profile) {
                startActivity(new Intent(this, HousekeeperProfile.class));
                return true;
            }
            return false;
        });
    }

    private void showCheckInDialog(BookingHousekeeperDTO booking) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("📋 Thông tin ca làm việc");
        builder.setMessage("Bạn có muốn Check-In công việc #" + booking.bookingID + " không?");
        builder.setPositiveButton("Check-In", (dialog, which) -> {
            Toast.makeText(this, "Check-In thành công!", Toast.LENGTH_SHORT).show();
        });
        builder.setNegativeButton("Hủy", null);
        builder.show();
    }
}
