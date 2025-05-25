package com.example.housekeeperapplication.Adapter;

import android.app.AlertDialog;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.R;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ApplicantAdapter extends RecyclerView.Adapter<ApplicantAdapter.ApplicantViewHolder> {

    public interface ApplicantClickListener {
        void onItemClick(ApplicationDisplayDTO applicant);
        void onAcceptClick(ApplicationDisplayDTO applicant, int position);
        void onRejectClick(ApplicationDisplayDTO applicant, int position);
    }

    private List<ApplicationDisplayDTO> applicants;
    private final ApplicantClickListener listener;
    private final APIServices apiService;
    private Context context;
    public ApplicantAdapter(List<ApplicationDisplayDTO> applicants, ApplicantClickListener listener, Context context) {
        this.applicants = applicants;
        this.listener = listener;
        this.apiService = APIClient.getClient(context).create(APIServices.class);
        this.context = context;
    }

    @NonNull
    @Override
    public ApplicantViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_applicant, parent, false);
        return new ApplicantViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ApplicantViewHolder holder, int position) {
        ApplicationDisplayDTO applicant = applicants.get(position);

        holder.tvApplicantName.setText(applicant.getHkName());
        double rating = applicant.getRating();
        holder.tvApplicantRating.setText(String.format("⭐ %.1f", rating));
        String imageUrl = applicant.getGoogleProfilePicture() != null ?
                applicant.getGoogleProfilePicture() : applicant.getLocalProfilePicture();
        Glide.with(holder.itemView.getContext())
                .load(imageUrl)
                .circleCrop()
                .into(holder.imgApplicant);
        if (applicant.getApplicationStatus() == 1) {
            holder.layoutActionButtons.setVisibility(View.VISIBLE);
        } else {
            holder.layoutActionButtons.setVisibility(View.GONE);
        }
        //holder.layoutActionButtons.setVisibility(View.VISIBLE);
        holder.itemView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onItemClick(applicant);
            }
        });
        holder.btnAccept.setOnClickListener(v -> {
            new AlertDialog.Builder(context)
                    .setTitle("Xác nhận chấp nhận")
                    .setMessage("Bạn có chắc muốn chấp nhận ứng viên này?")
                    .setPositiveButton("Chấp nhận", (dialog, which) -> {
                        if (listener != null) {
                            listener.onRejectClick(applicant, position);
                        }
                        updateApplicationStatus(applicant.getApplicationID(), 2, position);
                    })
                    .setNegativeButton("Hủy", null)
                    .show();
        });

        holder.btnReject.setOnClickListener(v -> {
            new AlertDialog.Builder(context)
                    .setTitle("Xác nhận từ chối")
                    .setMessage("Bạn có chắc muốn từ chối ứng viên này?")
                    .setPositiveButton("Từ chối", (dialog, which) -> {
                        if (listener != null) {
                            listener.onRejectClick(applicant, position);
                        }
                        updateApplicationStatus(applicant.getApplicationID(), 3, position);
                    })
                    .setNegativeButton("Hủy", null)
                    .show();
        });

    }
    private void updateApplicationStatus(int applicationID, int status, int position) {
        apiService.UpdateApplication(applicationID, status).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    applicants.get(position).setApplicationStatus(status);
                    notifyItemChanged(position);
                    String message = status == 2 ? "Đã chấp nhận ứng viên" : "Đã từ chối ứng viên";
                    Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
                    if (status == 3) {
                        applicants.remove(position);
                        notifyItemRemoved(position);
                    }
                } else {
                    Toast.makeText(context, "Có lỗi xảy ra: " + response.message(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(context, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public int getItemCount() {
        return applicants.size();
    }

    public void updateData(List<ApplicationDisplayDTO> newList) {
        this.applicants.clear();
        this.applicants.addAll(newList);
        notifyDataSetChanged();
    }
    public void removeApplicant(int position) {
        applicants.remove(position);
        notifyItemRemoved(position);
    }

    static class ApplicantViewHolder extends RecyclerView.ViewHolder {
        ImageView imgApplicant;
        TextView tvApplicantName, tvApplicantRating;
        Button btnAccept, btnReject;
        LinearLayout layoutActionButtons;

        public ApplicantViewHolder(@NonNull View itemView) {
            super(itemView);
            imgApplicant = itemView.findViewById(R.id.imgApplicant);
            tvApplicantName = itemView.findViewById(R.id.tvApplicantName);
            tvApplicantRating = itemView.findViewById(R.id.tvApplicantRating);
            btnAccept = itemView.findViewById(R.id.btnAccept);
            btnReject = itemView.findViewById(R.id.btnReject);
            layoutActionButtons = itemView.findViewById(R.id.layoutActionButtons);
        }
    }
}