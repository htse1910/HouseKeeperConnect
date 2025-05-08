package com.example.housekeeperapplication.Adapter;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Model.DTOs.HouseKeeperSkillDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperSkillMappingDisplayDTO;
import com.example.housekeeperapplication.R;

import java.util.List;

public class SkillAdapter extends RecyclerView.Adapter<SkillAdapter.SkillViewHolder> {

    private List<HouseKeeperSkillDisplayDTO> allSkills;
    private List<HousekeeperSkillMappingDisplayDTO> mySkills;
    private SkillActionListener listener;

    public interface SkillActionListener {
        void onAddSkill(int skillId);
        void onRemoveSkill(int skillId);
    }

    public SkillAdapter(List<HouseKeeperSkillDisplayDTO> allSkills,
                        List<HousekeeperSkillMappingDisplayDTO> mySkills,
                        SkillActionListener listener) {
        this.allSkills = allSkills;
        this.mySkills = mySkills;
        this.listener = listener;
    }

    @NonNull
    @Override
    public SkillViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_skill, parent, false);
        return new SkillViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SkillViewHolder holder, int position) {
        HouseKeeperSkillDisplayDTO skill = allSkills.get(position);
        holder.tvSkillName.setText(skill.getName());
        holder.tvSkillDescription.setText(skill.getDescription());

        // Kiểm tra xem kỹ năng này đã có trong danh sách của tôi chưa
        boolean isMySkill = isMySkill(skill.getHouseKeeperSkillID());

        if (isMySkill) {
            holder.btnAction.setText("Xóa");
            holder.btnAction.setBackgroundColor(Color.RED);
            holder.btnAction.setOnClickListener(v ->
                    listener.onRemoveSkill(skill.getHouseKeeperSkillID()));
        } else {
            holder.btnAction.setText("Thêm");
            holder.btnAction.setBackgroundColor(Color.GREEN);
            holder.btnAction.setOnClickListener(v ->
                    listener.onAddSkill(skill.getHouseKeeperSkillID()));
        }
    }

    private boolean isMySkill(int skillId) {
        for (HousekeeperSkillMappingDisplayDTO mapping : mySkills) {
            if (mapping.getHouseKeeperSkillID() == skillId) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int getItemCount() {
        return allSkills.size();
    }

    static class SkillViewHolder extends RecyclerView.ViewHolder {
        TextView tvSkillName;
        TextView tvSkillDescription;
        Button btnAction;

        public SkillViewHolder(@NonNull View itemView) {
            super(itemView);
            tvSkillName = itemView.findViewById(R.id.tvSkillName);
            tvSkillDescription = itemView.findViewById(R.id.tvSkillDescription);
            btnAction = itemView.findViewById(R.id.btnSkillAction);
        }
    }
}
