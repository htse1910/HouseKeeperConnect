package com.example.housekeeperapplication.Adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Model.ChatMessage;
import com.example.housekeeperapplication.R;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ChatMessageAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private final List<ChatMessage> messageList;
    private static final int TYPE_SENT = 1;
    private static final int TYPE_RECEIVED = 2;

    public ChatMessageAdapter(List<ChatMessage> messageList) {
        this.messageList = messageList;
    }

    @Override
    public int getItemViewType(int position) {
        return messageList.get(position).isSent() ? TYPE_SENT : TYPE_RECEIVED;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TYPE_SENT) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_message_sent, parent, false);
            return new SentViewHolder(view);
        } else {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_message_received, parent, false);
            return new ReceivedViewHolder(view);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ChatMessage message = messageList.get(position);
        try {

            if (holder instanceof SentViewHolder) {
                ((SentViewHolder) holder).tvMessageText.setText(message.getText());
                SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());

                // Define the desired output format
                SimpleDateFormat outputFormat = new SimpleDateFormat("dd-MM-yyyy'T'HH:mm:ss", Locale.getDefault());

                Date oDate = inputFormat.parse(message.getTime());
                String formatedDate = outputFormat.format(oDate);

                String date = formatedDate.replace("T", " ").substring(0, 16);
                ((SentViewHolder) holder).tvMessageTime.setText(date);
            } else if (holder instanceof ReceivedViewHolder) {
                ((ReceivedViewHolder) holder).tvMessageText.setText(message.getText());
                SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());

                // Define the desired output format
                SimpleDateFormat outputFormat = new SimpleDateFormat("dd-MM-yyyy'T'HH:mm:ss", Locale.getDefault());

                Date oDate = inputFormat.parse(message.getTime());
                String formatedDate = outputFormat.format(oDate);

                String date = formatedDate.replace("T", " ").substring(0, 16);
                ((ReceivedViewHolder) holder).tvMessageTime.setText(date);
            }
        }catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int getItemCount() {
        return messageList.size();
    }

    static class SentViewHolder extends RecyclerView.ViewHolder {
        TextView tvMessageText, tvMessageTime;
        SentViewHolder(View itemView) {
            super(itemView);
            tvMessageText = itemView.findViewById(R.id.tvMessageText);
            tvMessageTime = itemView.findViewById(R.id.tvMessageTime);
        }
    }

    static class ReceivedViewHolder extends RecyclerView.ViewHolder {
        TextView tvMessageText, tvMessageTime;
        ReceivedViewHolder(View itemView) {
            super(itemView);
            tvMessageText = itemView.findViewById(R.id.tvMessageText);
            tvMessageTime = itemView.findViewById(R.id.tvMessageTime);
        }
    }
}
