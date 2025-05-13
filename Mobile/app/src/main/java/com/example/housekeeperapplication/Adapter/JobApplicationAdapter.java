package com.example.housekeeperapplication.Adapter;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobItem;
import com.example.housekeeperapplication.R;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class JobApplicationAdapter extends RecyclerView.Adapter<JobApplicationAdapter.JobViewHolder> {

    private List<JobItem> jobItems;
    private OnItemClickListener listener;
    private APIServices apiService;
    private Context context;

    public interface OnItemClickListener {
        void onItemClick(JobItem jobItem);
    }

    public JobApplicationAdapter(List<JobItem> jobItems, OnItemClickListener listener, Context context) {
        this.jobItems = jobItems;
        this.listener = listener;
        this.context = context;
        this.apiService = APIClient.getClient(context).create(APIServices.class);
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
        if (position < 0 || position >= jobItems.size()) {
            return;
        }

        JobItem item = jobItems.get(position);
        Log.d("ADAPTER_DEBUG", "Binding item at position " + position + ": " + item.getJobName());

        // Set basic job info
        holder.tvJobTitle.setText(item.getJobName());
        holder.tvSalary.setText(formatCurrency(item.getSalary()));
        holder.tvTimeRange.setText(item.getStartDate() + " → " + item.getEndDate());

        // Set status
        holder.tvJobStatus.setText("Trạng thái: " + getStatusString(item.getStatus()));

        // Load family name
        loadFamilyName(item.getFamilyId(), holder.tvFamily);

        // Set click listener
        holder.btnViewDetail.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(item);
            }
        });
    }

    @Override
    public int getItemCount() {
        return jobItems != null ? jobItems.size() : 0;
    }

    public void updateData(List<JobItem> newItems) {
        jobItems.clear();
        jobItems.addAll(newItems);
        notifyDataSetChanged();
    }

    private String getStatusString(int status) {
        switch (status) {
            case 1: return "🕒 Đang chờ";
            case 2: return "✔️ Đã chấp nhận";
            case 3: return "📌 Đã từ chối";
            default: return "❓ Không xác định";
        }
    }

    private void loadFamilyName(int familyId, TextView familyNameView) {
        // Set loading text first
        familyNameView.setText("Đang tải...");
        familyNameView.setTag(familyId); // Use tag to prevent wrong data when recycling

        apiService.getFamilyByID(familyId).enqueue(new Callback<FamilyAccountMappingDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountMappingDTO> call, Response<FamilyAccountMappingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    int accountId = response.body().getAccountID();
                    fetchFamilyDetails(accountId, familyNameView, familyId);
                } else {
                    updateFamilyNameView(familyNameView, familyId, "Không xác định");
                    Log.e("API_ERROR", "Failed to get family mapping: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                updateFamilyNameView(familyNameView, familyId, "Không xác định");
                Log.e("NETWORK_ERROR", "Failed to get family mapping", t);
            }
        });
    }

    private void fetchFamilyDetails(int accountId, TextView familyNameView, int familyId) {
        apiService.getFamilyByAccountID(accountId).enqueue(new Callback<FamilyAccountDetailDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountDetailDTO> call, Response<FamilyAccountDetailDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String familyName = response.body().getName();
                    updateFamilyNameView(familyNameView, familyId, familyName != null ? familyName : "Không xác định");
                } else {
                    updateFamilyNameView(familyNameView, familyId, "Không xác định");
                    Log.e("API_ERROR", "Failed to get family details: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountDetailDTO> call, Throwable t) {
                updateFamilyNameView(familyNameView, familyId, "Không xác định");
                Log.e("NETWORK_ERROR", "Failed to get family details", t);
            }
        });
    }

    private void updateFamilyNameView(TextView view, int expectedFamilyId, String name) {
        if (view.getTag() != null && view.getTag().equals(expectedFamilyId)) {
            view.setText(name);
        }
    }

    private String formatCurrency(double amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return format.format(amount);
    }

    public static class JobViewHolder extends RecyclerView.ViewHolder {
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
}