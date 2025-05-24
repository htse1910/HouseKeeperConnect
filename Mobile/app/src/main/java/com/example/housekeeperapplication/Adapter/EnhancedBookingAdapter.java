package com.example.housekeeperapplication.Adapter;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.drawable.GradientDrawable;
import android.text.Layout;
import android.util.Log;
import android.util.SparseArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.BookingResponseDTO;
import com.example.housekeeperapplication.Model.Service;
import com.example.housekeeperapplication.R;
import com.google.android.flexbox.FlexboxLayout;


import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EnhancedBookingAdapter extends RecyclerView.Adapter<EnhancedBookingAdapter.BookingViewHolder> {
    private List<BookingResponseDTO> bookings;
    private final Context context;
    private final OnBookingActionListener listener;
    private final SparseArray<String> serviceNames = new SparseArray<>();
    private boolean servicesLoaded = false;
    private final APIServices apiServices;

    public interface OnBookingActionListener {
        void onCheckInClicked(BookingResponseDTO booking);
        void onCompleteJobClicked(BookingResponseDTO booking);
    }

    public EnhancedBookingAdapter(Context context, List<BookingResponseDTO> bookings, OnBookingActionListener listener) {
        this.context = context;
        this.bookings = bookings != null ? bookings : new ArrayList<>();
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
                    Log.d("ServiceLoad", "Loaded " + serviceNames.size() + " services");
                }
            }

            @Override
            public void onFailure(Call<List<Service>> call, Throwable t) {
                Log.e("ServiceLoad", "Failed to load services", t);
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
        BookingResponseDTO booking = bookings.get(position);
        if (booking == null) return;

        try {
            // Hiển thị thông tin cơ bản
            holder.tvBookingID.setText(String.format(Locale.getDefault(), "#%d", booking.bookingID));
            holder.tvJobTitle.setText(booking.jobName != null ? booking.jobName :
                    String.format(Locale.getDefault(), "Công việc #%d", booking.jobID));

            // Thông tin gia đình
            if (booking.familyname != null && !booking.familyname.isEmpty()) {
                holder.tvFamily.setText(String.format("👨‍👩‍👧‍👦 %s", booking.familyname));
                holder.tvFamily.setVisibility(View.VISIBLE);
            } else {
                holder.tvFamily.setVisibility(View.GONE);
            }

            // Trạng thái
            holder.tvJobStatus.setText(getStatusText(booking.bookingStatus));

            // Địa điểm
            String location = booking.location;
            if (booking.detailLocation != null && !booking.detailLocation.trim().isEmpty()) {
                location += ", " + booking.detailLocation.trim();
            }
            holder.tvLocation.setText(String.format("📍 %s", location));

            // Giá cả
            String priceText = String.format(Locale.getDefault(), "💵 %,.0f VND", booking.totalPrice);
            if (booking.pricePerHour > 0) {
                priceText += String.format(Locale.getDefault(), " (%,.0f VND/giờ)", booking.pricePerHour);
            }
            holder.tvSalary.setText(priceText);

            // Ngày tháng
            holder.tvStartDate.setText(String.format("📅 Bắt đầu: %s", formatDate(booking.startDate)));
            holder.tvEndDate.setText(String.format("📅 Kết thúc: %s", formatDate(booking.endDate)));

            // Mô tả
            holder.tvJobDescription.setText(String.format("📝 %s",
                    booking.description != null ? booking.description : "Không có mô tả"));

            // Ca làm việc
            if (booking.slotIDs != null && !booking.slotIDs.isEmpty()) {
                holder.tvSlot.setText(String.format("🕐 Ca: %s", getSlotString(booking.slotIDs)));
                holder.tvSlot.setVisibility(View.VISIBLE);
            } else {
                holder.tvSlot.setVisibility(View.GONE);
            }

            // Xử lý hiển thị các thứ làm việc
            holder.layoutWeekdays.removeAllViews();
            if (booking.dayofWeek != null && !booking.dayofWeek.isEmpty()) {
                for (int day : booking.dayofWeek) {
                    TextView tvDay = new TextView(context);
                    tvDay.setText(dayToString(day));
                    tvDay.setTextSize(14);
                    tvDay.setPadding(32, 8, 32, 8);

                    // Tạo background với bo tròn
                    GradientDrawable shape = new GradientDrawable();
                    shape.setShape(GradientDrawable.RECTANGLE);
                    shape.setCornerRadius(16f);

                    boolean isToday = isToday(day);
                    if (isToday) {
                        shape.setColor(ContextCompat.getColor(context, R.color.colorPrimary));
                        tvDay.setTextColor(ContextCompat.getColor(context, android.R.color.white));
                    } else {
                        shape.setColor(ContextCompat.getColor(context, R.color.gray));
                        tvDay.setTextColor(ContextCompat.getColor(context, R.color.black));
                    }

                    tvDay.setBackground(shape);

                    FlexboxLayout.LayoutParams params = new FlexboxLayout.LayoutParams(
                            FlexboxLayout.LayoutParams.WRAP_CONTENT,
                            FlexboxLayout.LayoutParams.WRAP_CONTENT
                    );
                    params.setMargins(0, 0, 8, 8); // Thêm margin right và bottom
                    tvDay.setLayoutParams(params);

                    tvDay.setOnClickListener(v -> {
                        if (isToday) {
                            holder.btnCheckIn.setVisibility(View.VISIBLE);
                        } else {
                            holder.btnCheckIn.setVisibility(View.GONE);
                            Toast.makeText(context,
                                    "Chỉ có thể check-in vào " + dayToString(day),
                                    Toast.LENGTH_SHORT).show();
                        }
                    });

                    holder.layoutWeekdays.addView(tvDay);
                }
            }



            // Nút Check-in (ẩn mặc định)
            holder.btnCheckIn.setVisibility(View.GONE);
            holder.btnCheckIn.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onCheckInClicked(booking);
                }
            });

            // Dịch vụ
            if (booking.serviceIDs != null && !booking.serviceIDs.isEmpty()) {
                StringBuilder servicesBuilder = new StringBuilder("🛎️ ");
                for (int i = 0; i < booking.serviceIDs.size(); i++) {
                    if (i > 0) servicesBuilder.append(", ");
                    int serviceId = booking.serviceIDs.get(i);
                    String serviceName = servicesLoaded ?
                            serviceNames.get(serviceId, String.format("Dịch vụ #%d", serviceId)) : "Đang tải...";
                    servicesBuilder.append(serviceName);
                }
                holder.tvServices.setText(servicesBuilder.toString());
                holder.tvServices.setVisibility(View.VISIBLE);
            } else {
                holder.tvServices.setVisibility(View.GONE);
            }
            // Nút hoàn thành công việc
            if (booking.bookingStatus == 3) {
                holder.btnCompleteJob.setVisibility(View.VISIBLE);
                holder.btnCompleteJob.setOnClickListener(v -> {
                    if (listener != null) {
                        listener.onCompleteJobClicked(booking);
                    }
                });
            } else {
                holder.btnCompleteJob.setVisibility(View.GONE);
            }

        } catch (Exception e) {
            Log.e("BookingAdapter", "Error binding data", e);
        }
    }

    private boolean isToday(int dayOfWeek) {
        Calendar calendar = Calendar.getInstance();
        int today = calendar.get(Calendar.DAY_OF_WEEK) - 1; // Chủ Nhật = 0
        return dayOfWeek == today;
    }

    private String getCurrentDateFormatted() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/M/yyyy", Locale.getDefault());
        return sdf.format(new Date());
    }

    private String getStatusText(int status) {
        switch (status) {
            case 1: return "🕒 Công việc đang chờ duyệt";
            case 2: return "✔️ Công việc đã xác minh";
            case 3: return "📌 Công việc đã chấp nhận";
            case 4: return "✅ Công việc đã hoàn thành";
            case 5: return "⏰ Công việc đã hết hạn";
            case 6: return "❌ Công việc đã hủy";
            case 7: return "🚫 Không được phép";
            case 8: return "👨‍👩‍👧 Công việc đang chờ xác nhận của gia đình";
            case 9: return "👨‍👩‍👧 Người giúp việc đã nghỉ";
            case 10: return "👨‍👩‍👧 Công việc đã giao lại";
            default: return "❓ Unknown";
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
            return rawDate.split("T")[0]; // Fallback to date part only
        }
    }

    private String getSlotString(List<Integer> slots) {
        if (slots == null || slots.isEmpty()) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < slots.size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append(slotToString(slots.get(i)));
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
        return bookings.size();
    }

    public void updateData(List<BookingResponseDTO> newBookings) {
        if (newBookings != null) {
            this.bookings = newBookings; // Gán thẳng list mới
            notifyDataSetChanged();
            Log.d("Adapter", "Data updated - Item count: " + getItemCount());
        } else {
            this.bookings.clear();
            notifyDataSetChanged();
        }
    }


    static class BookingViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobTitle, tvBookingID, tvFamily, tvLocation, tvSalary,
                tvStartDate, tvEndDate, tvJobDescription, tvSlot,
                tvServices, tvJobStatus, tvCurrentDate ;
        Button btnCancelJob, btnCompleteJob, btnCheckIn;
        FlexboxLayout  layoutWeekdays;

        public BookingViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobTitle = itemView.findViewById(R.id.tvJobTitle);
            tvBookingID = itemView.findViewById(R.id.tvBookingID);
            tvFamily = itemView.findViewById(R.id.tvFamily);
            tvJobStatus = itemView.findViewById(R.id.tvJobStatus);
            tvJobDescription = itemView.findViewById(R.id.tvJobDescription);
            tvLocation = itemView.findViewById(R.id.tvLocation);
            tvSalary = itemView.findViewById(R.id.tvSalary);
            tvStartDate = itemView.findViewById(R.id.tvStartDate);
            tvEndDate = itemView.findViewById(R.id.tvEndDate);
            tvSlot = itemView.findViewById(R.id.tvSlot);
            layoutWeekdays = itemView.findViewById(R.id.layoutWeekdays);
            tvServices = itemView.findViewById(R.id.tvServices);
            btnCheckIn = itemView.findViewById(R.id.btnCheckIn);
            btnCancelJob = itemView.findViewById(R.id.btnCancelJob);
            btnCompleteJob = itemView.findViewById(R.id.btnCompleteJob);
        }
    }
}