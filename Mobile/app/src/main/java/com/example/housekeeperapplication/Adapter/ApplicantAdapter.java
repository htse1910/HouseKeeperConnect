package com.example.housekeeperapplication.Adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.R;

import java.util.List;

public class ApplicantAdapter extends RecyclerView.Adapter<ApplicantAdapter.ApplicantViewHolder> {

    public interface ApplicantClickListener {
        void onViewProfileClick(ApplicationDisplayDTO applicant);
        void onMessageClick(ApplicationDisplayDTO applicant);
        void onAcceptClick(ApplicationDisplayDTO applicant);
        void onRejectClick(ApplicationDisplayDTO applicant);
    }

    private List<ApplicationDisplayDTO> applicants;
    private final ApplicantClickListener listener;
    private boolean showActionButtons; // Thêm biến để kiểm soát hiển thị nút

    public ApplicantAdapter(List<ApplicationDisplayDTO> applicants, ApplicantClickListener listener, boolean showActionButtons) {
        this.applicants = applicants;
        this.listener = listener;
        this.showActionButtons = showActionButtons;
    }

    public void updateData(List<ApplicationDisplayDTO> newApplicants) {
        this.applicants = newApplicants;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ApplicantViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_applicant, parent, false);
        return new ApplicantViewHolder(view, showActionButtons);
    }

    @Override
    public void onBindViewHolder(@NonNull ApplicantViewHolder holder, int position) {
        ApplicationDisplayDTO applicant = applicants.get(position);

        holder.tvApplicantName.setText(applicant.getNickname());
        double rating = applicant.getRating();
        holder.tvApplicantRating.setText(String.format("⭐ %.1f", rating));
        String imageUrl = applicant.getGoogleProfilePicture() != null ?
                applicant.getGoogleProfilePicture() : applicant.getLocalProfilePicture();
        Glide.with(holder.itemView.getContext())
                .load(imageUrl)
                .circleCrop()
                .into(holder.imgApplicant);
        // Xử lý sự kiện
        holder.btnViewProfile.setOnClickListener(v -> {
            if (listener != null) {
                listener.onViewProfileClick(applicant);
            }
        });

        holder.btnMessage.setOnClickListener(v -> {
            if (listener != null) {
                listener.onMessageClick(applicant);
            }
        });

        if (showActionButtons) {
            holder.btnAccept.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onAcceptClick(applicant);
                }
            });

            holder.btnReject.setOnClickListener(v -> {
                if (listener != null) {
                    listener.onRejectClick(applicant);
                }
            });
        }
    }


    @Override
    public int getItemCount() {
        return applicants != null ? applicants.size() : 0;
    }

    static class ApplicantViewHolder extends RecyclerView.ViewHolder {
        ImageView imgApplicant;
        TextView tvApplicantName, tvApplicantRating;
        Button btnViewProfile, btnMessage, btnAccept, btnReject;

        public ApplicantViewHolder(@NonNull View itemView, boolean showActionButtons) {
            super(itemView);
            imgApplicant = itemView.findViewById(R.id.imgApplicant);
            tvApplicantName = itemView.findViewById(R.id.tvApplicantName);
            tvApplicantRating = itemView.findViewById(R.id.tvApplicantRating);
            btnViewProfile = itemView.findViewById(R.id.btnViewProfile);
            btnMessage = itemView.findViewById(R.id.btnMessage);
            btnAccept = itemView.findViewById(R.id.btnAccept);
            btnReject = itemView.findViewById(R.id.btnReject);
        }
    }
}