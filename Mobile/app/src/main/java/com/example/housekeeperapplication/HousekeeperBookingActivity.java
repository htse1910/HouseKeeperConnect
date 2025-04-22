package com.example.housekeeperapplication;

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
import com.example.housekeeperapplication.Model.DTOs.BookingDTO;
import com.example.housekeeperapplication.R;

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
            Call<List<BookingDTO>> call = api.getBookingsByHousekeeperID(housekeeperId);

            call.enqueue(new Callback<List<BookingDTO>>() {
                @Override
                public void onResponse(Call<List<BookingDTO>> call, Response<List<BookingDTO>> response) {
                    if (response.isSuccessful()) {
                        List<BookingDTO> bookings = response.body();
                        bookingAdapter = new BookingAdapter(HousekeeperBookingActivity.this, bookings, booking -> {
                            showCheckInDialog(booking); // Implement check-in logic
                        });
                        rvBookings.setAdapter(bookingAdapter);
                    } else {
                        Toast.makeText(HousekeeperBookingActivity.this, "Không tải được dữ liệu", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<List<BookingDTO>> call, Throwable t) {
                    Toast.makeText(HousekeeperBookingActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private void showCheckInDialog(BookingDTO booking) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("📋 Thông tin ca làm việc");
        builder.setMessage("Bạn có muốn Check-In công việc #" + booking.getBookingID() + " không?");
        builder.setPositiveButton("Check-In", (dialog, which) -> {
            Toast.makeText(this, "Check-In thành công!", Toast.LENGTH_SHORT).show();
        });
        builder.setNegativeButton("Hủy", null);
        builder.show();
    }
}
