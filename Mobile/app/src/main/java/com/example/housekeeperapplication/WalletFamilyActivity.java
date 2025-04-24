package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.TransactionAdapter;
import com.example.housekeeperapplication.Model.Transaction;
import com.example.housekeeperapplication.Model.Wallet;

import java.io.IOException;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class WalletFamilyActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_family_wallet);

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1); // -1 nếu chưa login


        APIServices api = APIClient.getClient(WalletFamilyActivity.this).create(APIServices.class);
        Call<Wallet> call = api.getWalletById(accountId);
        call.enqueue(new Callback<Wallet>() {
            @Override
            public void onResponse(Call<Wallet> call, Response<Wallet> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Wallet wallet = response.body();

                    TextView tvBalance = findViewById(R.id.tvWalletBalance);
                    TextView tvOnHold = findViewById(R.id.tvOnHold);
                    TextView tvLastUpdate = findViewById(R.id.tvLastUpdate);

                    tvBalance.setText(wallet.getBalance() + "₫");
                    tvOnHold.setText("Giữ: " + wallet.getOnHold() + "₫");

                    String updatedDate = wallet.getUpdatedAt().substring(0, 10);
                    tvLastUpdate.setText("Cập nhật: " + updatedDate);
                } else {
                    Toast.makeText(WalletFamilyActivity.this, "Ví không tồn tại", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Wallet> call, Throwable t) {
                Toast.makeText(WalletFamilyActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        // transaction
        RecyclerView rvTransactions = findViewById(R.id.rvTransactions);
        TextView tvNoTransactions = findViewById(R.id.tvNoTransactions);
        rvTransactions.setLayoutManager(new LinearLayoutManager(this));

        int pageNumber = 1;
        int pageSize = 10;
        Call<List<Transaction>> transactionCall = api.getTransactionByUserID(accountId, pageNumber, pageSize);
        transactionCall.enqueue(new Callback<List<Transaction>>() {
            @Override
            public void onResponse(Call<List<Transaction>> call, Response<List<Transaction>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Transaction> transactions = response.body();

                    if (transactions.isEmpty()) {
                        tvNoTransactions.setVisibility(View.VISIBLE);
                        rvTransactions.setVisibility(View.GONE);
                    } else {
                        tvNoTransactions.setVisibility(View.GONE);
                        rvTransactions.setVisibility(View.VISIBLE);
                        TransactionAdapter adapter = new TransactionAdapter(transactions);
                        rvTransactions.setAdapter(adapter);
                    }
                } else {
                    Log.e("API_ERROR", "Mã lỗi: " + response.code());
                    try {
                        Log.e("API_ERROR", "Lỗi chi tiết: " + response.errorBody().string());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    Toast.makeText(WalletFamilyActivity.this, "Không thể tải giao dịch", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Transaction>> call, Throwable t) {
                Toast.makeText(WalletFamilyActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });

        Button btnWithdraw = findViewById(R.id.btnWithdraw);
        btnWithdraw.setOnClickListener(v -> {
            Intent intent = new Intent(WalletFamilyActivity.this, RequestWithdrawActivity.class);
            startActivity(intent);
        });
    }
}
