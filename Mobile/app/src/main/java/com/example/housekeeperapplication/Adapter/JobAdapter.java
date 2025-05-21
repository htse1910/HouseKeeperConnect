package com.example.housekeeperapplication.Adapter;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.Job;
import com.example.housekeeperapplication.R;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobAdapter extends RecyclerView.Adapter<JobAdapter.JobViewHolder> {

    private List<Job> originalJobs;
    private List<Job> filteredJobs;
    private OnJobClickListener listener;
    private APIServices apiService;
    private Context context;;

    public interface OnJobClickListener {
        void onJobClick(Job job);
    }

    public JobAdapter(List<Job> jobList, OnJobClickListener listener, Context context) {
        this.originalJobs = new ArrayList<>(jobList);
        this.filteredJobs = new ArrayList<>(jobList);
        this.listener = listener;
        this.context = context;
        this.apiService = APIClient.getClient(context).create(APIServices.class);
    }
    public void filter(String text) {
        filteredJobs.clear();

        if(text.isEmpty()) {
            filteredJobs.addAll(originalJobs);
        } else {
            String searchText = text.toLowerCase().trim();
            for(Job job : originalJobs) {
                if(job.getJobName() != null &&
                        job.getJobName().toLowerCase().contains(searchText)) {
                    filteredJobs.add(job);
                }
            }
        }
        notifyDataSetChanged();
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
        if (position < 0 || position >= filteredJobs.size()) {
            return; // Bảo vệ khỏi index out of bounds
        }

        Job job = filteredJobs.get(position);

        holder.tvJobTitle.setText(job.getJobName());
        holder.tvLocation.setText(job.getLocation());
        holder.tvSalary.setText(String.format("%,.0f VND", job.getPrice()));
        holder.tvStatus.setText("Đã duyệt");

        // Set job type text based on jobType code
        String typeText = "";
        switch (job.getJobType()) {
            case 1: typeText = "1 lần duy nhất"; break;
            case 2: typeText = "Định kỳ"; break;
        }
        holder.tvType.setText(typeText);

        // Initially set family name to "Loading..."
        holder.tvFamilyName.setText("Đang tải...");

        // Fetch family details
        fetchFamilyName(job.getFamilyID(), holder.tvFamilyName);

        holder.itemView.setOnClickListener(v -> listener.onJobClick(job));
    }

    private void fetchFamilyName(int familyID, TextView tvFamilyName) {
        // First get the family to get accountID
        apiService.getFamilyByID(familyID).enqueue(new Callback<FamilyAccountMappingDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountMappingDTO> call, Response<FamilyAccountMappingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int accountID = response.body().getAccountID();

                    // Now get the family details with account info
                    apiService.getFamilyByAccountID(accountID).enqueue(new Callback<FamilyAccountDetailDTO>() {
                        @Override
                        public void onResponse(Call<FamilyAccountDetailDTO> call, Response<FamilyAccountDetailDTO> response) {
                            if (response.isSuccessful() && response.body() != null) {
                                String name = response.body().getName();
                                tvFamilyName.setText("Gia đình: " + name);
                            } else {
                                tvFamilyName.setText("Gia đình: Không xác định");
                                Log.e("API_ERROR", "Error getting family details: " + response.message());
                            }
                        }

                        @Override
                        public void onFailure(Call<FamilyAccountDetailDTO> call, Throwable t) {
                            tvFamilyName.setText("Gia đình: Không xác định");
                            Log.e("NETWORK_ERROR", "Failed to get family details", t);
                        }
                    });
                } else {
                    tvFamilyName.setText("Gia đình: Không xác định");
                    Log.e("API_ERROR", "Error getting family: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                tvFamilyName.setText("Gia đình: Không xác định");
                Log.e("NETWORK_ERROR", "Failed to get family", t);
            }
        });
    }

    @Override
    public int getItemCount() {
        return filteredJobs != null ? filteredJobs.size() : 0;
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
        originalJobs.clear();
        originalJobs.addAll(newJobs);
        filter(""); // Reset filter khi cập nhật dữ liệu mới
    }
}