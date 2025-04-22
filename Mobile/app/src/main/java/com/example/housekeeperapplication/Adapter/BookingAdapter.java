// Adapter
package com.example.housekeeperapplication.Adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.BookingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailDTO;
import com.example.housekeeperapplication.Model.Job;
import com.example.housekeeperapplication.R;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookingAdapter extends RecyclerView.Adapter<BookingAdapter.BookingViewHolder> {
    private final List<BookingDTO> bookings;
    private final Context context;
    private final OnBookingActionListener listener;
    private final APIServices apiServices;

    public interface OnBookingActionListener {
        void onCheckInClicked(BookingDTO booking);
    }

    public BookingAdapter(Context context, List<BookingDTO> bookings, OnBookingActionListener listener) {
        this.context = context;
        this.bookings = bookings;
        this.listener = listener;
        this.apiServices = APIClient.getClient(context).create(APIServices.class);
    }

    @NonNull
    @Override
    public BookingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_booking, parent, false);
        return new BookingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BookingViewHolder holder, int position) {
        BookingDTO booking = bookings.get(position);
        JobDetailDTO detail = booking.getJobDetail();

        // Job Title
        String jobName = "[Không rõ công việc]";
        if (detail != null && detail.getJob() != null && detail.getJob().getJobName() != null) {
            jobName = detail.getJob().getJobName();
            holder.tvJobTitle.setText("🧽 " + jobName);
        } else if (detail != null) {
            apiServices.getJobById(detail.getJobID()).enqueue(new Callback<Job>() {
                @Override
                public void onResponse(Call<Job> call, Response<Job> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        holder.tvJobTitle.setText("🧽 " + response.body().getJobName());
                    }
                }

                @Override
                public void onFailure(Call<Job> call, Throwable t) {
                    holder.tvJobTitle.setText("🧽 [Không rõ công việc]");
                }
            });
        } else {
            holder.tvJobTitle.setText("🧽 [Không rõ công việc]");
        }

        holder.tvBookingID.setText("#" + booking.getBookingID());
        holder.tvFamily.setText("👨 Gia đình: Lâm Bùi Văn Tuấn");

        if (detail != null) {
            holder.tvLocation.setText("📍 Địa điểm: " + detail.getLocation());
            holder.tvSalary.setText("💵 Lương: " + detail.getPrice() + " VND");
            holder.tvStartDate.setText("📅 Bắt đầu: " + formatDate(detail.getStartDate()));
            holder.tvEndDate.setText("📅 Kết thúc: " + formatDate(detail.getEndDate()));
            holder.tvDescription.setText("📝 Mô tả: " + detail.getDescription());
        }

        holder.tvSlot.setText("🕐 Ca làm việc: 16H - 17H");

        if (booking.getDayofWeek() != null && !booking.getDayofWeek().isEmpty()) {
            holder.tvWeekday.setText("📆 Thứ: Thứ " + booking.getDayofWeek().get(0));
        }

        holder.tvServices.setText("🛎️ Dịch vụ: Giữ trẻ theo giờ");

        holder.btnCheckIn.setOnClickListener(v -> {
            apiServices.checkIn(booking.getBookingID()).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(context, "✅ Check-In thành công!", Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(context, "❌ Check-In thất bại", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Toast.makeText(context, "⚠️ Lỗi kết nối", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }

    private String formatDate(String rawDate) {
        if (rawDate == null || !rawDate.contains("T")) return rawDate;
        return rawDate.split("T")[0];
    }

    @Override
    public int getItemCount() {
        return bookings != null ? bookings.size() : 0;
    }

    static class BookingViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobTitle, tvBookingID, tvFamily, tvLocation, tvSalary, tvStartDate, tvEndDate, tvDescription, tvSlot, tvWeekday, tvServices;
        Button btnCheckIn;

        public BookingViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobTitle = itemView.findViewById(R.id.tvJobTitle);
            tvBookingID = itemView.findViewById(R.id.tvBookingID);
            tvFamily = itemView.findViewById(R.id.tvFamily);
            tvLocation = itemView.findViewById(R.id.tvLocation);
            tvSalary = itemView.findViewById(R.id.tvSalary);
            tvStartDate = itemView.findViewById(R.id.tvStartDate);
            tvEndDate = itemView.findViewById(R.id.tvEndDate);
            tvDescription = itemView.findViewById(R.id.tvDescription);
            tvSlot = itemView.findViewById(R.id.tvSlot);
            tvWeekday = itemView.findViewById(R.id.tvWeekday);
            tvServices = itemView.findViewById(R.id.tvServices);
            btnCheckIn = itemView.findViewById(R.id.btnCheckIn);
        }
    }
}
