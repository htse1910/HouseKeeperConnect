package com.example.housekeeperapplication.Adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Model.CombinedJobApplication;
import com.example.housekeeperapplication.R;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class JobApplicationAdapter extends RecyclerView.Adapter<JobApplicationAdapter.JobViewHolder> {

    private List<CombinedJobApplication> combinedJobs;
    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(CombinedJobApplication job);
    }

    public JobApplicationAdapter(List<CombinedJobApplication> combinedJobs, OnItemClickListener listener) {
        this.combinedJobs = combinedJobs;
        this.listener = listener;
    }

    @NonNull
    @Override
    public JobViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_job_housekeeper, parent, false);
        return new JobViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull JobViewHolder holder, int position) {
        CombinedJobApplication item = combinedJobs.get(position);
        holder.bind(item, listener);
    }

    @Override
    public int getItemCount() {
        return combinedJobs != null ? combinedJobs.size() : 0;
    }

    public void updateData(List<CombinedJobApplication> newData) {
        combinedJobs = newData;
        notifyDataSetChanged();
    }

    // ViewHolder class
    public static class JobViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobTitle, tvFamily, tvSalary, tvTimeRange, tvJobStatus;

        public JobViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobTitle = itemView.findViewById(R.id.tvJobTitle);
            tvFamily = itemView.findViewById(R.id.tvFamily);
            tvSalary = itemView.findViewById(R.id.tvSalary);
            tvTimeRange = itemView.findViewById(R.id.tvTimeRange);
            tvJobStatus = itemView.findViewById(R.id.tvJobStatus);
        }

        public void bind(final CombinedJobApplication item, final OnItemClickListener listener) {
            // Set data to views
            tvJobTitle.setText(item.getJobName());
            tvFamily.setText(item.getFamilyName());
            tvSalary.setText(formatCurrency(item.getPrice()));

            // Format date range
            String startDate = formatDate(item.getStartDate());
            String endDate = formatDate(item.getEndDate());
            tvTimeRange.setText(String.format("%s → %s", startDate, endDate));

            // Set status text and background
            tvJobStatus.setText(getStatusText(item));


            // Handle item click
            itemView.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onItemClick(item);
                }
            });
        }

        private String formatCurrency(double price) {
            return String.format(Locale.getDefault(), "%,.0f VND", price);
        }

        private String formatDate(String dateString) {
            try {
                SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
                SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
                Date date = inputFormat.parse(dateString);
                return outputFormat.format(date);
            } catch (ParseException e) {
                e.printStackTrace();
                return dateString;
            }
        }

        private String getStatusText(CombinedJobApplication item) {
            // Ưu tiên kiểm tra jobStatus trước
            if (item.getJobStatus() == 4) {
                return "✅ Đã hoàn thành";
            }

            // Sau đó mới xét bookingStatus
            switch (item.getAplicationStatus()) {
                case 1: return "🕒 Đang chờ xác nhận";
                case 2: return "✔️ Đã xác nhận";
                case 3: return "❌ Đã từ chối";
                default: return "❓ Trạng thái không xác định";
            }
        }
    }
}