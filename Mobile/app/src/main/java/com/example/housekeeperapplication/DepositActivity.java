package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.DTOs.PaymentLinkDTO;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DepositActivity extends AppCompatActivity {

    private Button depositBtn;
    private EditText edDeposit;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_deposit);
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountID = prefs.getInt("accountID", -1);

        depositBtn = findViewById(R.id.btnDeposit);
        edDeposit = findViewById(R.id.etDepositAmount);
        boolean isMobile = true;
        depositBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                APIServices api = APIClient.getClient(DepositActivity.this).create(APIServices.class);
                int balance = Integer.parseInt(edDeposit.getText().toString());
                Call<PaymentLinkDTO> call = api.deposit(accountID, balance, isMobile);
                depositBtn.setEnabled(false);
                call.enqueue(new Callback<PaymentLinkDTO>() {
                    @Override
                    public void onResponse(Call<PaymentLinkDTO> call, Response<PaymentLinkDTO> response) {
                        if(response.isSuccessful() && response.body()!=null){
                            depositBtn.setEnabled(true);
                            PaymentLinkDTO url = response.body();
                            Log.d("PaymentURL", response.body().getPaymentUrl());
                            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url.getPaymentUrl())));
                            finish();
                        }else{
                            depositBtn.setEnabled(true);
                            Toast.makeText(DepositActivity.this, "Lỗi server: " + response.errorBody().toString(), Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<PaymentLinkDTO> call, Throwable t) {
                        depositBtn.setEnabled(true);
                        Toast.makeText(DepositActivity.this, "Lỗi server: " + t.getMessage().toString(), Toast.LENGTH_SHORT).show();
                    }
                });
                /*call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        if(response.isSuccessful() && response.body()!=null){
                            depositBtn.setEnabled(true);
                            String url = response.body();
                            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            startActivity(browserIntent);
                            finish();
                        }else{
                            depositBtn.setEnabled(true);
                            Toast.makeText(DepositActivity.this, "Lỗi server: " + response.errorBody().toString(), Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<String> call, Throwable t) {
                        depositBtn.setEnabled(true);
                        Toast.makeText(DepositActivity.this, "Lỗi server: " + t.getMessage().toString(), Toast.LENGTH_SHORT).show();
                    }
                });*/
            }
        });

    }
}
