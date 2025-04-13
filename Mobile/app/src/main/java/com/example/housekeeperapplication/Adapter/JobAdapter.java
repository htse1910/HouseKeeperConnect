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
    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(Job job);
    }

    public JobAdapter(List<Job> jobList, OnItemClickListener listener) {
        this.jobList = jobList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public JobViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_job_home_housekeeper, parent, false);
        return new JobViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull JobViewHolder holder, int position) {
        Job job = jobList.get(position);
        holder.tvTitle.setText(job.getJobName());
        holder.tvFamily.setText(job.getFamilyName());
        holder.tvLocation.setText(job.getLocation());
        holder.tvSalary.setText(job.getSalary());
        holder.tvType.setText(job.getType());

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(job);
            }
        });
    }

    @Override
    public int getItemCount() {
        return jobList.size();
    }

    public static class JobViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvFamily, tvLocation, tvSalary, tvType;

        public JobViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvJobTitle);
            tvFamily = itemView.findViewById(R.id.tvFamilyName);
            tvLocation = itemView.findViewById(R.id.tvLocation);
            tvSalary = itemView.findViewById(R.id.tvSalary);
            tvType = itemView.findViewById(R.id.tvType);
        }
    }
}
