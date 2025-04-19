package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;

import org.json.JSONObject;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RequestWithdrawActivity extends AppCompatActivity {

    private EditText etWithdrawAmount;
    private Button btnSendOtp, btnCancelWithdraw;
    private APIServices api;
    private int accountId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.dialog_withdrawal);

        etWithdrawAmount = findViewById(R.id.etWithdrawAmount);
        btnSendOtp = findViewById(R.id.btnSendOtp);
        btnCancelWithdraw = findViewById(R.id.btnCancelWithdraw);

        // Lấy accountId từ SharedPreferences
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        accountId = prefs.getInt("accountID", -1);

        if (accountId == -1) {
            Toast.makeText(this, "Không tìm thấy tài khoản. Vui lòng đăng nhập lại.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        api = APIClient.getClient(this).create(APIServices.class);

        btnSendOtp.setOnClickListener(v -> {
            String amountStr = etWithdrawAmount.getText().toString().trim();

            if (amountStr.isEmpty()) {
                Toast.makeText(this, "Vui lòng nhập số tiền", Toast.LENGTH_SHORT).show();
                return;
            }

            int amount;
            try {
                amount = Integer.parseInt(amountStr);
            } catch (NumberFormatException e) {
                Toast.makeText(this, "Số tiền không hợp lệ", Toast.LENGTH_SHORT).show();
                return;
            }

            if (amount <= 0) {
                Toast.makeText(this, "Số tiền phải lớn hơn 0", Toast.LENGTH_SHORT).show();
                return;
            }

            btnSendOtp.setEnabled(false); // Disable nút gửi để tránh bấm nhiều lần

            api.requestWithdrawOTP(accountId, amount).enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    btnSendOtp.setEnabled(true); // Mở lại nút sau khi xử lý

                    if (response.isSuccessful()) {
                        try {
                            // Đọc dữ liệu từ response
                            String body = response.body().string();
                            JSONObject jsonObject = new JSONObject(body);

                            // Kiểm tra và lấy thông tin từ response
                            int withdrawId = jsonObject.optInt("withdrawID", -1);
                            String otpExpiredTime = jsonObject.optString("otpExpiredTime", "");

                            if (withdrawId == -1) {
                                Toast.makeText(RequestWithdrawActivity.this, "Không thể lấy mã rút tiền, vui lòng thử lại", Toast.LENGTH_SHORT).show();
                                return;
                            }

                            if (otpExpiredTime.isEmpty()) {
                                Toast.makeText(RequestWithdrawActivity.this, "Mã OTP hết hạn", Toast.LENGTH_SHORT).show();
                                return;
                            }

                            Toast.makeText(RequestWithdrawActivity.this, "Đã gửi mã OTP về email", Toast.LENGTH_SHORT).show();

                            // Chuyển sang màn hình VerifyOTPActivity và gửi withdrawId
                            Intent intent = new Intent(RequestWithdrawActivity.this, VerifyOTPActivity.class);
                            intent.putExtra("withdrawID", withdrawId); // Gửi withdrawId hợp lệ
                            intent.putExtra("otpExpiredTime", otpExpiredTime); // Gửi otpExpiredTime
                            startActivity(intent);
                        } catch (Exception e) {
                            Toast.makeText(RequestWithdrawActivity.this, "Lỗi khi xử lý phản hồi", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        try {
                            String errorMsg = response.errorBody() != null ? response.errorBody().string() : "Yêu cầu thất bại";
                            Toast.makeText(RequestWithdrawActivity.this, errorMsg, Toast.LENGTH_LONG).show();
                        } catch (Exception e) {
                            Toast.makeText(RequestWithdrawActivity.this, "Đã xảy ra lỗi khi đọc phản hồi", Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    btnSendOtp.setEnabled(true); // Mở lại nút khi có lỗi
                    Toast.makeText(RequestWithdrawActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });

        });

        btnCancelWithdraw.setOnClickListener(v -> finish());
    }
}
