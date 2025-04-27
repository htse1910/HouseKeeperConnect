package com.example.housekeeperapplication.Adapter;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.ChatListMockActivity;
import com.example.housekeeperapplication.ChatPageMockActivity;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.ChatMessage;
import com.example.housekeeperapplication.Model.DTOs.ChatUserDTO;
import com.example.housekeeperapplication.R;
import com.squareup.picasso.Picasso;

import java.util.List;

public class ChatListAdapter extends RecyclerView.Adapter<ChatListAdapter.AccountViewHolder> {

    private final List<ChatUserDTO> accList;
    private final Context context;

    public ChatListAdapter(List<ChatUserDTO> accList, Context context) {
        this.accList = accList;
        this.context = context;
    }

    @NonNull
    @Override
    public AccountViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_chataccount, parent, false);
        return new AccountViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AccountViewHolder holder, int position) {
        ChatUserDTO acc = accList.get(position);
        holder.tvName.setText(acc.getName());
        if(acc.getRoleID()==1){
            holder.tvRole.setText("Giúp việc");
        }
        if(acc.getRoleID()==2){
            holder.tvRole.setText("Gia đình");
        }
        String avatar = (acc.getLocalProfilePicture() != null && !acc.getLocalProfilePicture().isEmpty())
                ? acc.getLocalProfilePicture()
                : acc.getGoogleProfilePicture();

        holder.tvToAcc.setVisibility(View.INVISIBLE);
        holder.tvFromAcc.setVisibility(View.INVISIBLE);

        holder.chatAccBox.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent chatBoxIntent = new Intent(context, ChatPageMockActivity.class);
                chatBoxIntent.putExtra("fromAcc", acc.getFromAccountID());
                chatBoxIntent.putExtra("toAcc", acc.getToAccountID());
                context.startActivity(chatBoxIntent);
            }
        });

        if (avatar != null && !avatar.isEmpty()) {
            Picasso.get().load(avatar).into(holder.imgProfile);
        } else {
            holder.imgProfile.setImageResource(R.drawable.ic_person); // fallback
        }
    }

    @Override
    public int getItemCount() {
        return accList.size();
    }

    public static class AccountViewHolder extends RecyclerView.ViewHolder {
        ImageView imgProfile;
        TextView tvName, tvRole, tvFromAcc, tvToAcc;
        LinearLayout chatAccBox;

        public AccountViewHolder(@NonNull View itemView) {
            super(itemView);
            imgProfile = itemView.findViewById(R.id.imgProfile);
            tvName = itemView.findViewById(R.id.tvName);
            tvRole = itemView.findViewById(R.id.tvRole);
            tvFromAcc = itemView.findViewById(R.id.tvFromAcc);
            tvToAcc = itemView.findViewById(R.id.tvToAcc);
            chatAccBox = itemView.findViewById(R.id.chatCardBox);
        }
    }
}
