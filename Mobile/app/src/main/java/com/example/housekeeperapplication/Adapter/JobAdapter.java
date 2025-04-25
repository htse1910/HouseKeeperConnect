package com.example.housekeeperapplication.Adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Model.Job;
import com.example.housekeeperapplication.R;

import java.util.List;

public class JobAdapter extends RecyclerView.Adapter<JobAdapter.JobViewHolder> {

    private List<Job> jobList;
    private OnJobClickListener listener;
    public interface OnJobClickListener {
        void onJobClick(Job job);
    }
    public JobAdapter(List<Job> jobList, OnJobClickListener listener) {
        this.jobList = jobList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public JobViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_job_home_housekeeper, parent, false);
        return new JobViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull JobViewHolder holder, int position) {
        Job job = jobList.get(position);

        holder.tvJobTitle.setText(job.getJobName());
        holder.tvFamilyName.setText("Gia đình: " + job.getFamilyID());
        holder.tvLocation.setText(job.getLocation());
        holder.tvSalary.setText(String.format("%,.0f VND", job.getPrice()));
        holder.tvStatus.setText("Đã duyệt");

        // Set job type text based on jobType code
        String typeText = "";
        switch (job.getJobType()) {
            case 1: typeText = "Part-time"; break;
            case 2: typeText = "Full-time"; break;
        }
        holder.tvType.setText(typeText);

        holder.itemView.setOnClickListener(v -> listener.onJobClick(job));
    }

    @Override
    public int getItemCount() {
        return jobList.size();
    }

    public static class JobViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobTitle, tvFamilyName, tvLocation, tvSalary, tvStatus, tvType;

        public JobViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobTitle = itemView.findViewById(R.id.tvJobTitle);
            tvFamilyName = itemView.findViewById(R.id.tvFamilyName);
            tvLocation = itemView.findViewById(R.id.tvLocation);
            tvSalary = itemView.findViewById(R.id.tvSalary);
            tvStatus = itemView.findViewById(R.id.tvStatus);
            tvType = itemView.findViewById(R.id.tvType);
        }
    }

    public void updateData(List<Job> newJobs) {
        jobList.clear();
        jobList.addAll(newJobs);
        notifyDataSetChanged();
    }
}