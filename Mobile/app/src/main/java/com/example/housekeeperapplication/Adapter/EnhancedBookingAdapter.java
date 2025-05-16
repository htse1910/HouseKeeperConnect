package com.example.housekeeperapplication.Adapter;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.util.SparseArray;
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
import com.example.housekeeperapplication.Model.DTOs.BookingHousekeeperDTO;
import com.example.housekeeperapplication.Model.DTOs.EnhancedBookingDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.Model.Service;
import com.example.housekeeperapplication.R;
import com.google.gson.Gson;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EnhancedBookingAdapter extends RecyclerView.Adapter<EnhancedBookingAdapter.BookingViewHolder> {
    private final List<EnhancedBookingDTO> bookings;
    private final Context context;
    private final OnBookingActionListener listener;
    private final APIServices apiServices;
    private final SparseArray<String> serviceNames = new SparseArray<>();
    private boolean servicesLoaded = false;

    public interface OnBookingActionListener {
        void onBookingClicked(EnhancedBookingDTO booking);
        void onCheckInClicked(EnhancedBookingDTO booking);
        void onCompleteJobClicked(EnhancedBookingDTO booking);
    }

    public EnhancedBookingAdapter(Context context, List<EnhancedBookingDTO> bookings, OnBookingActionListener listener) {
        this.context = context;
        this.bookings = bookings;
        this.listener = listener;
        this.apiServices = APIClient.getClient(context).create(APIServices.class);
        loadServiceNames();
    }

    private void loadServiceNames() {
        apiServices.getServiceList().enqueue(new Callback<List<Service>>() {
            @Override
            public void onResponse(Call<List<Service>> call, Response<List<Service>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (Service service : response.body()) {
                        serviceNames.put(service.getServiceID(), service.getServiceName());
                    }
                    servicesLoaded = true;
                    notifyDataSetChanged();
                }
            }

            @Override
            public void onFailure(Call<List<Service>> call, Throwable t) {
                Log.e("EnhancedBookingAdapter", "Failed to load services", t);
            }
        });
    }

    @NonNull
    @Override
    public BookingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_booking, parent, false);
        return new BookingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BookingViewHolder holder, int position) {
        EnhancedBookingDTO booking = bookings.get(position);
        if (booking == null) return;

        // Hiển thị thông tin cơ bản
        holder.tvBookingID.setText("#" + booking.bookingID);
        holder.tvJobTitle.setText(booking.jobName != null ? booking.jobName : "Công việc #" + booking.jobID);

        // Hiển thị thông tin gia đình
        if (booking.familyName != null) {
            holder.tvFamily.setText("👨‍👩‍👧‍👦 " + booking.familyName);
        }



        // Hiển thị thông tin chi tiết
        displayBasicInfo(holder, booking);
        displayScheduleInfo(holder, booking);
        displayStatusInfo(booking.status);
        displayServices(holder, booking.serviceIDs);

        // Xử lý sự kiện
        setupClickListeners(holder, booking);
    }

    private void displayBasicInfo(BookingViewHolder holder, EnhancedBookingDTO booking) {
        holder.tvDescription.setText("📝 " + (booking.description != null ? booking.description : "Không có mô tả"));
        holder.tvLocation.setText("📍 " + (booking.location != null ? booking.location : "Địa điểm chưa xác định"));
        holder.tvSalary.setText("💵 " + formatPrice(booking.price));
        holder.tvStartDate.setText("📅 Bắt đầu: " + formatDate(booking.startDate));
        holder.tvEndDate.setText("📅 Kết thúc: " + formatDate(booking.endDate));
    }

    private void displayScheduleInfo(BookingViewHolder holder, EnhancedBookingDTO booking) {
        if (booking.slotIDs != null && !booking.slotIDs.isEmpty()) {
            holder.tvSlot.setText("🕐 Ca: " + getSlotString(booking.slotIDs));
        }
        if (booking.dayofWeek != null && !booking.dayofWeek.isEmpty()) {
            holder.tvWeekday.setText("📆 Thứ: " + getWeekdayString(booking.dayofWeek));
        }
    }

    private void displayServices(BookingViewHolder holder, List<Integer> serviceIDs) {
        if (serviceIDs != null && !serviceIDs.isEmpty()) {
            StringBuilder servicesBuilder = new StringBuilder("🛎️ ");
            for (int i = 0; i < serviceIDs.size(); i++) {
                if (i > 0) servicesBuilder.append(", ");
                int serviceId = serviceIDs.get(i);
                String serviceName = servicesLoaded ? serviceNames.get(serviceId, "Dịch vụ #" + serviceId)
                        : "Đang tải...";
                servicesBuilder.append(serviceName);
            }
            holder.tvServices.setText(servicesBuilder.toString());
        } else {
            holder.tvServices.setText("🛎️ Chưa có dịch vụ");
        }
    }

    private String displayStatusInfo(int status) {
        switch (status) {
            case 1: return "🕒 Công việc đang chờ duyệt";
            case 2: return "✔️ Công việc đã xác minh";
            case 3: return "📌 Công việc đã chấp nhận";
            case 4: return "✅ Công việc đã hoàn thành";
            case 5: return "❌ Công việc đã hủy";
            case 6: return "🕒Chờ xác nhận của gia đình";
            default: return "❓ Unknown";
        }

    }

    private void setupClickListeners(BookingViewHolder holder, EnhancedBookingDTO booking) {
        // Click toàn bộ item
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onBookingClicked(booking);
            }
        });

        // Click vào nút Check-In


        // Click vào nút Hoàn thành
        holder.btnCompleteJob.setOnClickListener(v -> {
            if (listener != null) {
                listener.onCompleteJobClicked(booking);
            }
        });
    }

    private String formatPrice(double price) {
        return String.format(Locale.getDefault(), "%,.0f VND", price);
    }

    private String formatDate(String rawDate) {
        if (rawDate == null) return "Chưa xác định";
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            Date date = inputFormat.parse(rawDate);
            return outputFormat.format(date);
        } catch (Exception e) {
            return rawDate.split("T")[0]; // Fallback
        }
    }

    private String getSlotString(List<Integer> slots) {
        if (slots == null || slots.isEmpty()) return "Chưa xác định";
        StringBuilder sb = new StringBuilder();
        for (int slot : slots) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(slotToString(slot));
        }
        return sb.toString();
    }

    private String slotToString(int slot) {
        switch (slot) {
            case 1: return "8H-9H";
            case 2: return "9H-10H";
            case 3: return "10H-11H";
            case 4: return "11H-12H";
            case 5: return "12H-13H";
            case 6: return "13H-14H";
            case 7: return "14H-15H";
            case 8: return "15H-16H";
            case 9: return "16H-17H";
            case 10: return "17H-18H";
            case 11: return "18H-19H";
            case 12: return "19H-20H";
            default: return slot + "H-" + (slot+1) + "H";
        }
    }

    private String getWeekdayString(List<Integer> days) {
        if (days == null || days.isEmpty()) return "Chưa xác định";
        StringBuilder sb = new StringBuilder();
        for (int day : days) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(dayToString(day));
        }
        return sb.toString();
    }

    private String dayToString(int day) {
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

    @Override
    public int getItemCount() {
        return bookings != null ? bookings.size() : 0;
    }

    public void updateData(List<EnhancedBookingDTO> newBookings) {
        this.bookings.clear();
        this.bookings.addAll(newBookings);
        notifyDataSetChanged();
    }

    static class BookingViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobTitle, tvBookingID, tvFamily, tvLocation, tvSalary,
                tvStartDate, tvEndDate, tvDescription, tvSlot, tvWeekday,
                tvServices, tvJobStatus;
        Button btnCancelJob, btnCompleteJob;

        public BookingViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobTitle = itemView.findViewById(R.id.tvJobTitle);
            tvBookingID = itemView.findViewById(R.id.tvBookingID);
            tvFamily = itemView.findViewById(R.id.tvFamily);
            tvJobStatus = itemView.findViewById(R.id.tvJobStatus);
            tvDescription = itemView.findViewById(R.id.tvJobDescription);
            tvLocation = itemView.findViewById(R.id.tvLocation);
            tvSalary = itemView.findViewById(R.id.tvSalary);
            tvStartDate = itemView.findViewById(R.id.tvStartDate);
            tvEndDate = itemView.findViewById(R.id.tvEndDate);
            tvSlot = itemView.findViewById(R.id.tvSlot);
            tvWeekday = itemView.findViewById(R.id.tvWeekday);
            tvServices = itemView.findViewById(R.id.tvServices);
            btnCancelJob = itemView.findViewById(R.id.btnCancelJob);
            btnCompleteJob = itemView.findViewById(R.id.btnCompleteJob);
        }
    }
}