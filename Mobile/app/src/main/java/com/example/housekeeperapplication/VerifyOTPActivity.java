package com.example.housekeeperapplication;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class VerifyOTPActivity extends AppCompatActivity {

    private EditText etOtpCode;
    private Button btnConfirmOtp, btnCancelOtp;
    private APIServices api;
    private int withdrawId;
    private String otpExpiredTime;
    private TextView tvOtpExpiresAt; // Thêm TextView để hiển thị thời gian hết hạn OTP

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.dialog_otp_verification);

        etOtpCode = findViewById(R.id.etOtpCode);
        btnConfirmOtp = findViewById(R.id.btnConfirmOtp);
        btnCancelOtp = findViewById(R.id.btnCancelOtp);
        tvOtpExpiresAt = findViewById(R.id.tvOtpExpiresAt); // Khởi tạo TextView

        api = APIClient.getClient(this).create(APIServices.class);

        // Lấy withdrawId và otpExpiredTime từ Intent
        withdrawId = getIntent().getIntExtra("withdrawID", -1);
        otpExpiredTime = getIntent().getStringExtra("otpExpiredTime");

        if (withdrawId == -1 || otpExpiredTime.isEmpty()) {
            Toast.makeText(this, "Dữ liệu không hợp lệ. Vui lòng thử lại.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Chuyển đổi thời gian hết hạn
        String formattedTime = formatDate(otpExpiredTime);
        tvOtpExpiresAt.setText("Mã hết hạn lúc: " + formattedTime);

        btnConfirmOtp.setOnClickListener(v -> {
            String otp = etOtpCode.getText().toString().trim();
            if (otp.isEmpty()) {
                Toast.makeText(this, "Vui lòng nhập mã OTP", Toast.LENGTH_SHORT).show();
                return;
            }

            btnConfirmOtp.setEnabled(false); // Vô hiệu hóa nút để tránh bấm nhiều lần

            api.verifyOTP(withdrawId, otp).enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    btnConfirmOtp.setEnabled(true); // Kích hoạt lại nút sau khi xử lý

                    if (response.isSuccessful()) {
                        Toast.makeText(VerifyOTPActivity.this, "Xác minh OTP thành công!", Toast.LENGTH_SHORT).show();

                        // Quay lại WalletHousekeeperActivity và làm mới dữ liệu
                        Intent intent = new Intent(VerifyOTPActivity.this, WalletHousekeeperActivity.class);
                        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);  // Xóa các Activity trước đó trong stack
                        startActivity(intent);
                    } else {
                        try {
                            String errorMsg = response.errorBody() != null ? response.errorBody().string() : "Lỗi không xác định";
                            Toast.makeText(VerifyOTPActivity.this, errorMsg, Toast.LENGTH_LONG).show();
                        } catch (Exception e) {
                            Toast.makeText(VerifyOTPActivity.this, "Đã xảy ra lỗi khi xử lý phản hồi", Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    btnConfirmOtp.setEnabled(true); // Kích hoạt lại nút khi có lỗi
                    Toast.makeText(VerifyOTPActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        });

        btnCancelOtp.setOnClickListener(v -> finish());
    }

    // Hàm chuyển đổi định dạng ngày từ "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS+zz:zz" sang "HH:mm:ss dd/MM/yyyy"
    private String formatDate(String dateStr) {
        try {
            // Định dạng ban đầu
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSSSSSZ");
            Date date = inputFormat.parse(dateStr);

            // Định dạng cần chuyển sang, giờ, phút, giây trước ngày, tháng, năm
            SimpleDateFormat outputFormat = new SimpleDateFormat("HH:mm:ss dd/MM/yyyy");
            return outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
            return "Không thể định dạng";
        }
    }

}
