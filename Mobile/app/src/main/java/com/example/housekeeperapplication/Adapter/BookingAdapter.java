package com.example.housekeeperapplication.Adapter;

import android.app.Dialog;
import android.content.Context;
import android.content.SharedPreferences;
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
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.R;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookingAdapter extends RecyclerView.Adapter<BookingAdapter.BookingViewHolder> {
    private final List<BookingHousekeeperDTO> bookings;
    private final Context context;
    private final OnBookingActionListener listener;
    private final APIServices apiServices;

    public interface OnBookingActionListener {
        void onCheckInClicked(BookingHousekeeperDTO booking);
    }

    public BookingAdapter(Context context, List<BookingHousekeeperDTO> bookings, OnBookingActionListener listener) {
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
        BookingHousekeeperDTO booking = bookings.get(position);
        BookingHousekeeperDTO.JobDetail detail = booking.jobDetail;

        holder.tvJobTitle.setText("🧽 [Không rõ công việc]");
        apiServices.getJobDetailByID(booking.jobID).enqueue(new Callback<JobDetailForBookingDTO>() {
            @Override
            public void onResponse(Call<JobDetailForBookingDTO> call, Response<JobDetailForBookingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int familyID = response.body().familyID;
                    int status = response.body().status;
                    holder.tvJobStatus.setText("📌 Trạng thái: " + getJobStatusString(response.body().status));

                }
                if (response.isSuccessful() && response.body() != null) {
                    int familyID = response.body().familyID;

                    apiServices.getFamilyByID(familyID).enqueue(new Callback<FamilyAccountMappingDTO>() {
                        @Override
                        public void onResponse(Call<FamilyAccountMappingDTO> call, Response<FamilyAccountMappingDTO> response) {
                            if (response.isSuccessful() && response.body() != null) {
                                int accountID = response.body().accountID;

                                apiServices.getFamilyByAccountID(accountID).enqueue(new Callback<FamilyAccountDetailDTO>() {
                                    @Override
                                    public void onResponse(Call<FamilyAccountDetailDTO> call, Response<FamilyAccountDetailDTO> response) {
                                        if (response.isSuccessful() && response.body() != null) {
                                            holder.tvFamily.setText("👨 Gia đình: " + response.body().name);
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<FamilyAccountDetailDTO> call, Throwable t) {
                                        holder.tvFamily.setText("👨 Gia đình: [Không rõ tên]");
                                    }
                                });
                            }
                        }

                        @Override
                        public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                            holder.tvFamily.setText("👨 Gia đình: [Không rõ tên]");
                        }
                    });
                }
            }

            @Override
            public void onFailure(Call<JobDetailForBookingDTO> call, Throwable t) {
                holder.tvFamily.setText("👨 Gia đình: [Không rõ tên]");
            }
        });

        holder.btnCompleteJob.setOnClickListener(v -> {
            SharedPreferences prefs = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE);
            int accountId = prefs.getInt("accountID", -1);

            apiServices.completeJobByHousekeeper(booking.jobID, accountId).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    Toast.makeText(context,
                            response.isSuccessful() ? "🎉 Hoàn thành công việc!" : "❌ Hoàn thành thất bại",
                            Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Toast.makeText(context, "⚠️ Lỗi kết nối", Toast.LENGTH_SHORT).show();
                }
            });
        });



        if (detail != null) {
            holder.tvJobTitle.setText("🧽 Công việc #" + detail.jobID);
            holder.tvLocation.setText("📍 Địa điểm: " + detail.location);
            holder.tvSalary.setText("💵 Lương: " + detail.pricePerHour + " VND/h");
            holder.tvStartDate.setText("📅 Bắt đầu: " + formatDate(detail.startDate));
            holder.tvEndDate.setText("📅 Kết thúc: " + formatDate(detail.endDate));
            holder.tvDescription.setText("📝 Mô tả: " + detail.description);
        }

        holder.tvBookingID.setText("#" + booking.bookingID);
        holder.tvSlot.setText("🕐 Ca làm việc: " + getSlotString(booking.slotIDs));
        holder.tvWeekday.setText("📆 Thứ: " + getWeekdayString(booking.dayofWeek));
        holder.tvServices.setText("🛎️ Dịch vụ: " + getServiceString(booking.serviceIDs));

        holder.btnCheckIn.setOnClickListener(v -> showCheckInDialog(booking));
    }
    private String getJobStatusString(int status) {
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

    private void showCheckInDialog(BookingHousekeeperDTO booking) {
        Dialog dialog = new Dialog(context);
        dialog.setContentView(R.layout.dialog_check_in);

        TextView tvJobName = dialog.findViewById(R.id.tvJobName);
        TextView tvFamilyName = dialog.findViewById(R.id.tvFamilyName);
        TextView tvStartDate = dialog.findViewById(R.id.tvStartDate);
        TextView tvEndDate = dialog.findViewById(R.id.tvEndDate);
        TextView tvDayOfWeek = dialog.findViewById(R.id.tvDayOfWeek);
        TextView tvMatchedDate = dialog.findViewById(R.id.tvMatchedDate);
        Button btnCheckIn = dialog.findViewById(R.id.btnCheckInDialog);
        Button btnClose = dialog.findViewById(R.id.btnCloseDialog);

        BookingHousekeeperDTO.JobDetail detail = booking.jobDetail;
        if (detail != null) {
            tvJobName.setText("🔧 Công việc ID: " + detail.jobID);
            tvFamilyName.setText("👨 Gia đình ID: " + detail.housekeeperID);
            tvStartDate.setText("📅 Bắt đầu: " + formatDate(detail.startDate));
            tvEndDate.setText("📅 Kết thúc: " + formatDate(detail.endDate));
        }

        tvDayOfWeek.setText("📆 Thứ: " + getWeekdayString(booking.dayofWeek));
        tvMatchedDate.setText("📋 Ngày này: " + new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).format(new Date()));

        btnCheckIn.setOnClickListener(v -> {
            apiServices.checkIn(booking.bookingID).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    Toast.makeText(context,
                            response.isSuccessful() ? "✅ Check-In thành công!" : "❌ Check-In thất bại",
                            Toast.LENGTH_SHORT).show();
                    dialog.dismiss();
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Toast.makeText(context, "⚠️ Lỗi kết nối", Toast.LENGTH_SHORT).show();
                }
            });
        });

        btnClose.setOnClickListener(v -> dialog.dismiss());
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.show();
    }

    private String formatDate(String rawDate) {
        if (rawDate == null || !rawDate.contains("T")) return rawDate;
        return rawDate.split("T")[0];
    }

    private String getSlotString(List<Integer> slots) {
        if (slots == null || slots.isEmpty()) return "[Không rõ]";
        int slot = slots.get(0);
        switch (slot) {
            case 1: return "8H - 9H";
            case 2: return "9H - 10H";
            case 3: return "10H - 11H";
            case 4: return "11H - 12H";
            case 5: return "12H - 13H";
            case 6: return "13H - 14H";
            case 7: return "14H - 15H";
            case 8: return "15H - 16H";
            case 9: return "16H - 17H";
            case 10: return "17H - 18H";
            case 11: return "18H - 19H";
            case 12: return "19H - 20H";
            default: return "Ca #" + slot;
        }
    }

    private String getWeekdayString(List<Integer> days) {
        if (days == null || days.isEmpty()) return "[Không rõ]";
        int day = days.get(0);
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

    private String getServiceString(List<Integer> services) {
        if (services == null || services.isEmpty()) return "[Không rõ]";
        int service = services.get(0);
        switch (service) {
            case 1: return "Dọn dẹp";
            case 2: return "Tổng vệ sinh";
            case 3: return "Dọn dẹp theo giờ";
            case 4: return "Giữ trẻ tại nhà";
            case 5: return "Chăm sóc người già";
            case 6: return "Nấu ăn theo yêu cầu";
            case 7: return "Nấu ăn theo giờ";
            case 8: return "Giặt ủi";
            case 9: return "Ủi quần áo";
            case 10: return "Giặt hấp";
            case 11: return "Chăm sóc thú cưng";
            case 12: return "Tưới cây, chăm cây";
            case 13: return "Tắm & cắt lông thú";
            case 14: return "Sửa chữa điện nước";
            case 15: return "Sơn sửa đồ đạc";
            case 16: return "Thợ sửa chuyên nghiệp";
            case 17: return "Giúp việc theo tháng";
            case 18: return "Hỗ trợ vận chuyển";
            default: return "Dịch vụ #" + service;
        }
    }

    @Override
    public int getItemCount() {
        return bookings != null ? bookings.size() : 0;
    }

    static class BookingViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobTitle, tvBookingID, tvFamily, tvLocation, tvSalary,
                tvStartDate, tvEndDate, tvDescription, tvSlot, tvWeekday, tvServices;
        Button btnCheckIn, btnCompleteJob;
        TextView tvJobStatus; // Add this to the top with other TextViews

        public BookingViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobStatus = itemView.findViewById(R.id.tvJobStatus); // inside the constructor
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
            btnCompleteJob = itemView.findViewById(R.id.btnCompleteJob); // 🔥 new line
        }
    }
}
