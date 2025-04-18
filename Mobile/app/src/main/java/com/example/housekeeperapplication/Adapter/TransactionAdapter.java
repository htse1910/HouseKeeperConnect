package com.example.housekeeperapplication.Adapter;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.Model.Transaction;
import com.example.housekeeperapplication.R;

import java.util.List;

public class TransactionAdapter extends RecyclerView.Adapter<TransactionAdapter.TransactionViewHolder> {
    private List<Transaction> transactionList;

    public TransactionAdapter(List<Transaction> transactionList) {
        this.transactionList = transactionList;
    }

    @NonNull
    @Override
    public TransactionViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_transaction, parent, false);
        return new TransactionViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TransactionViewHolder holder, int position) {
        Transaction transaction = transactionList.get(position);
        holder.description.setText(transaction.getDescription());

        // Định dạng ngày
        String date = transaction.getCreatedDate().replace("T", " ").substring(0, 16);
        holder.date.setText(date);

        // Định dạng số tiền
        String formattedAmount = String.format("%,.0f₫", transaction.getAmount());
        holder.amount.setText((transaction.getTransactionType() == 1 ? "+" : "-") + formattedAmount);

        // Đổi màu tiền: xanh cho cộng, đỏ cho trừ
        int color = transaction.getTransactionType() == 1 ? Color.parseColor("#4CAF50") : Color.parseColor("#F44336");
        holder.amount.setTextColor(color);
    }

    @Override
    public int getItemCount() {
        return transactionList.size();
    }

    public static class TransactionViewHolder extends RecyclerView.ViewHolder {
        TextView description, date, amount;

        public TransactionViewHolder(@NonNull View itemView) {
            super(itemView);
            description = itemView.findViewById(R.id.tvTransactionDescription);
            date = itemView.findViewById(R.id.tvTransactionDate);
            amount = itemView.findViewById(R.id.tvTransactionAmount);
        }
    }
}
