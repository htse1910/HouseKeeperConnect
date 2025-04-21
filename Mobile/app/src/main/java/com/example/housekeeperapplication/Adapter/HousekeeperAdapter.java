package com.example.housekeeperapplication.Adapter;

import android.app.AlertDialog;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayForFamilyDTO;
import com.example.housekeeperapplication.R;

import java.util.List;

public class HousekeeperAdapter extends RecyclerView.Adapter<HousekeeperAdapter.HousekeeperViewHolder> {

    private final List<HousekeeperDisplayForFamilyDTO> housekeepers;
    private final Context context;

    public HousekeeperAdapter(Context context, List<HousekeeperDisplayForFamilyDTO> housekeepers) {
        this.context = context;
        this.housekeepers = housekeepers;
    }

    @NonNull
    @Override
    public HousekeeperViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_housekeeper, parent, false);
        return new HousekeeperViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull HousekeeperViewHolder holder, int position) {
        HousekeeperDisplayForFamilyDTO hk = housekeepers.get(position);

        holder.tvName.setText(hk.getName());
        holder.tvIntro.setText(hk.getIntroduction());

        String avatar = (hk.getLocalProfilePicture() != null && !hk.getLocalProfilePicture().isEmpty())
                ? hk.getLocalProfilePicture()
                : hk.getGoogleProfilePicture();

        if (avatar != null && !avatar.isEmpty()) {
            Glide.with(context).load(avatar).into(holder.imgProfile);
        } else {
            holder.imgProfile.setImageResource(R.drawable.ic_person); // fallback
        }

        holder.btnViewDetails.setOnClickListener(v -> showDetailsDialog(hk));
    }

    @Override
    public int getItemCount() {
        return housekeepers.size();
    }

    private void showDetailsDialog(HousekeeperDisplayForFamilyDTO hk) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        View view = LayoutInflater.from(context).inflate(R.layout.dialog_housekeeper_details, null);
        builder.setView(view);

        TextView tvName = view.findViewById(R.id.tvDialogName);
        TextView tvAddress = view.findViewById(R.id.tvDialogAddress);
        TextView tvIntro = view.findViewById(R.id.tvDialogIntro);
        TextView tvSkills = view.findViewById(R.id.tvDialogSkills);
        TextView tvSalary = view.findViewById(R.id.tvDialogSalary);
        TextView tvWorkType = view.findViewById(R.id.tvDialogWorkType);
        TextView tvRating = view.findViewById(R.id.tvDialogRating);
        ImageView imgProfile = view.findViewById(R.id.imgDialogProfile);

        tvName.setText(hk.getName());
        tvAddress.setText("📍 " + hk.getAddress());
        tvIntro.setText("🗒️ " + hk.getIntroduction());

        if (hk.getSkills() != null && !hk.getSkills().isEmpty()) {
            tvSkills.setText("🧹 " + String.join(", ", hk.getSkills()));
        } else {
            tvSkills.setText("🧹 Không có kỹ năng");
        }

        tvSalary.setText("💰 " + hk.getSalary() + " đ/giờ");
        tvWorkType.setText("⏱️ " + hk.getWorkType());
        tvRating.setText("⭐ " + hk.getRating());

        String avatar = hk.getLocalProfilePicture() != null && !hk.getLocalProfilePicture().isEmpty()
                ? hk.getLocalProfilePicture()
                : hk.getGoogleProfilePicture();
        if (avatar != null && !avatar.isEmpty()) {
            Glide.with(context).load(avatar).into(imgProfile);
        }

        builder.setPositiveButton("Đóng", null);
        builder.create().show();
    }

    public static class HousekeeperViewHolder extends RecyclerView.ViewHolder {
        ImageView imgProfile;
        TextView tvName, tvIntro;
        Button btnViewDetails;

        public HousekeeperViewHolder(@NonNull View itemView) {
            super(itemView);
            imgProfile = itemView.findViewById(R.id.imgProfile);
            tvName = itemView.findViewById(R.id.tvName);
            tvIntro = itemView.findViewById(R.id.tvIntro);
            btnViewDetails = itemView.findViewById(R.id.btnViewDetails);
        }
    }
}
