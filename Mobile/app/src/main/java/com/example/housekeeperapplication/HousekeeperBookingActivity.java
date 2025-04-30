package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
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
import com.example.housekeeperapplication.profile.FamilyProfile;
import com.example.housekeeperapplication.profile.HousekeeperProfile;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HousekeeperBookingActivity extends AppCompatActivity {

    RecyclerView rvBookings;
    BookingAdapter bookingAdapter;
    private TextView tvEmptyList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.housekeeper_booking_management);

        rvBookings = findViewById(R.id.rvBookings);
        rvBookings.setLayoutManager(new LinearLayoutManager(this));
        tvEmptyList = findViewById(R.id.tvEmptyList);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int housekeeperId = prefs.getInt("housekeeperID", -1);
        int roleID = prefs.getInt("roleID", 0);

        if (housekeeperId != -1) {
            APIServices api = APIClient.getClient(this).create(APIServices.class);
            Call<List<BookingHousekeeperDTO>> call = api.getBookingsByHousekeeperID(housekeeperId);

            call.enqueue(new Callback<List<BookingHousekeeperDTO>>() {
                @Override
                public void onResponse(Call<List<BookingHousekeeperDTO>> call, Response<List<BookingHousekeeperDTO>> response) {
                    if (response.isSuccessful() && response.body()!=null) {
                        tvEmptyList.setVisibility(View.INVISIBLE);
                        tvEmptyList.setEnabled(false);
                        List<BookingHousekeeperDTO> bookings = response.body();
                        bookingAdapter = new BookingAdapter(HousekeeperBookingActivity.this, bookings, booking -> {
                            showCheckInDialog(booking);
                        });
                        rvBookings.setAdapter(bookingAdapter);
                    } else if(response.isSuccessful() && response.body()==null) {
                        tvEmptyList.setEnabled(true);
                        tvEmptyList.setVisibility(View.VISIBLE);
                    }
                }

                @Override
                public void onFailure(Call<List<BookingHousekeeperDTO>> call, Throwable t) {
                    Toast.makeText(HousekeeperBookingActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setSelectedItemId(R.id.nav_activity);
        bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            if (itemId == R.id.nav_home) {
                if(roleID==1){
                    startActivity(new Intent(this, HomeHousekeeperActivity.class));
                }else if(roleID==2){
                    startActivity(new Intent(this, HomeActivity.class));
                }
                return true;
            } else if (itemId == R.id.nav_activity) {
                if(roleID==1){
                    startActivity(new Intent(this, HousekeeperBookingActivity.class));
                }else if(roleID==2){
                    startActivity(new Intent(this, FamilyJobListActivity.class));
                }
                return true;
            } else if (itemId == R.id.nav_notification) {
                startActivity(new Intent(this, NotificationActivity.class));
                return true;
            } else if (itemId == R.id.nav_chat) {
                startActivity(new Intent(this, ChatListMockActivity.class));
                return true;
            } else if (itemId == R.id.nav_profile) {
                if(roleID==1){
                    startActivity(new Intent(this, HousekeeperProfile.class));
                }else if(roleID==2){
                    startActivity(new Intent(this, FamilyProfile.class));
                }
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
