package com.example.housekeeperapplication.Adapter;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Model.DTOs.JobItem;
import com.example.housekeeperapplication.R;

import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class JobApplicationAdapter extends RecyclerView.Adapter<JobApplicationAdapter.JobViewHolder> {
        private List<JobItem> jobItems;
    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(JobItem jobItem);
    }

    public JobApplicationAdapter(List<JobItem> jobItems, OnItemClickListener listener) {
        this.jobItems = jobItems;
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
        JobItem item = jobItems.get(position);

        holder.tvJobTitle.setText(item.getJobName());
        holder.tvFamily.setText(item.getFamilyName());
        holder.tvSalary.setText(formatCurrency(item.getSalary()));
        holder.tvTimeRange.setText(item.getStartDate() + " → " + item.getEndDate());

        // Set trạng thái
        String statusText = "";
        int bgColor = R.color.gray;
        switch (item.getStatus()) {
            case 1: // Đã xác nhận
                statusText = "Đã xác nhận";
                bgColor = R.color.successGreen;
                break;
            case 2: // Đã từ chối
                statusText = "Đã từ chối";
                bgColor = R.color.errorRed;
                break;
            default: // Đang chờ
                statusText = "Đang chờ";
                bgColor = R.color.warningYellow;
        }
        holder.tvJobStatus.setText(statusText);
        holder.tvJobStatus.setBackgroundResource(bgColor);

        holder.btnViewDetail.setOnClickListener(v -> listener.onItemClick(item));
    }

    @Override
    public int getItemCount() {
        return jobItems.size();
    }

    static class JobViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobTitle, tvFamily, tvSalary, tvTimeRange, tvJobStatus;
        Button btnViewDetail;

        public JobViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobTitle = itemView.findViewById(R.id.tvJobTitle);
            tvFamily = itemView.findViewById(R.id.tvFamily);
            tvSalary = itemView.findViewById(R.id.tvSalary);
            tvTimeRange = itemView.findViewById(R.id.tvTimeRange);
            tvJobStatus = itemView.findViewById(R.id.tvJobStatus);
            btnViewDetail = itemView.findViewById(R.id.btnViewDetail);
        }
    }

    private String formatDateRange(Date start, Date end) {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
        return sdf.format(start) + " → " + sdf.format(end);
    }

    private String formatCurrency(double amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return format.format(amount);
    }
}
