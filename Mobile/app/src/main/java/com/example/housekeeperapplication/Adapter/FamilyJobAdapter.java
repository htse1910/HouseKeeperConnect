package com.example.housekeeperapplication.Adapter;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.JobDetailActivity;
import com.example.housekeeperapplication.Model.DTOs.FamilyJobSummaryDTO;
import com.example.housekeeperapplication.R;

import java.util.List;

public class FamilyJobAdapter extends RecyclerView.Adapter<FamilyJobAdapter.JobViewHolder> {

    private final Context context;
    private final List<FamilyJobSummaryDTO> jobList;

    public FamilyJobAdapter(Context context, List<FamilyJobSummaryDTO> jobList) {
        this.context = context;
        this.jobList = jobList;
    }

    @NonNull
    @Override
    public JobViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_family_job, parent, false);
        return new JobViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull JobViewHolder holder, int position) {
        FamilyJobSummaryDTO job = jobList.get(position);
        holder.tvJobName.setText("🧽 " + job.getJobName());
        holder.tvJobLocation.setText("📍 Địa điểm: " + job.getLocation());
        holder.tvJobSalary.setText("💵 Lương: " + job.getPrice() + " VND");
        holder.tvJobType.setText("⚙️ Loại: " + (job.getJobType() == 1 ? "Full-time" : "Part-time"));
        holder.tvJobStatus.setText("📌 Trạng thái: " + getJobStatusString(job.getStatus()));
        /*holder.btnDelete.setOnClickListener(v -> {
            Toast.makeText(context, "Đã xóa công việc", Toast.LENGTH_SHORT).show();
        });*/
        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, JobDetailActivity.class);
            intent.putExtra("jobID", job.getJobID());
            context.startActivity(intent);
        });
    }

    @Override
    public int getItemCount() {
        return jobList != null ? jobList.size() : 0;
    }

    static class JobViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobName, tvJobLocation, tvJobSalary, tvJobType, tvJobStatus;
        Button btnDelete;

        public JobViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobName = itemView.findViewById(R.id.tvJobName);
            tvJobLocation = itemView.findViewById(R.id.tvJobLocation);
            tvJobSalary = itemView.findViewById(R.id.tvJobSalary);
            tvJobType = itemView.findViewById(R.id.tvJobType);
            tvJobStatus = itemView.findViewById(R.id.tvJobStatus);
            btnDelete = itemView.findViewById(R.id.btnDelete);
        }
    }

    private String getJobStatusString(int status) {
        switch (status) {
            case 1: return "🕒 Pending";
            case 2: return "✔️ Verified";
            case 3: return "📌 Accepted";
            case 4: return "✅ Completed";
            case 5: return "⏰ Expired";
            case 6: return "❌ Canceled";
            case 7: return "🚫 Not Permitted";
            case 8: return "👨‍👩‍👧 Đợi xác nhận";
            default: return "❓ Unknown";
        }
    }
}
