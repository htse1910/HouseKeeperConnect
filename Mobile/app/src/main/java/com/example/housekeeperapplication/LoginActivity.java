package com.example.housekeeperapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.auth0.android.jwt.JWT;
import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.example.housekeeperapplication.Model.DTOs.LoginInfo;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText emailTxt, passTxt;
    private Button loginBtn;
    private TextView regTxt;
    private LinearLayout lnRegGoogle;
    private SharedPreferences sharedPreferences;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sharedPreferences = getSharedPreferences("user_prefs", MODE_PRIVATE);

        emailTxt = findViewById(R.id.email);
        passTxt = findViewById(R.id.password);
        loginBtn = findViewById(R.id.loginBTN);
        regTxt = findViewById(R.id.txt_register);

        lnRegGoogle = findViewById(R.id.lvRegGoogle);
        
        lnRegGoogle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(LoginActivity.this, "Tính năng này đang được phát triển!", Toast.LENGTH_SHORT).show();
            }
        });

        regTxt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent regIntent = new Intent(LoginActivity.this, Register.class);
                startActivity(regIntent);
                finish();
            }
        });

        loginBtn.setOnClickListener(v -> {
            String email = emailTxt.getText().toString();
            String password = passTxt.getText().toString();

            if(email.isEmpty()|| password.isEmpty()){
                Toast.makeText(LoginActivity.this, "Input blank!", Toast.LENGTH_SHORT).show();
                return;
            }

            loginBtn.setEnabled(false);

            APIServices api = APIClient.getClient(LoginActivity.this).create(APIServices.class);
            LoginInfo logInfo = new LoginInfo(email, password);

            Call<Account> call = api.login(logInfo);
            if(call == null){
                Toast.makeText(LoginActivity.this, "Incorrect email or password", Toast.LENGTH_SHORT).show();
                return;
            }
            call.enqueue(new Callback<Account>() {
                @Override
                public void onResponse(Call<Account> call, Response<Account> response) {
                    if (response.isSuccessful()) {
                        Account acc = response.body();
                        if (acc != null) {
                            int accountID = acc.getAccountID();
                            String uEmail = acc.getEmail();
                            String uToken = acc.getToken();
                            String uName = acc.getName();
                            int roleID = acc.getRoleID();
                            boolean isLoggedIn = true;


                            SharedPreferences.Editor editor = sharedPreferences.edit();
                            editor.putInt("accountID", accountID);
                            editor.putString("email", uEmail);
                            editor.putString("token", uToken);
                            editor.putInt("roleID", roleID);
                            editor.putString("name", uName);
                            editor.putBoolean("isLoggedIn", isLoggedIn);
                            editor.apply();

                            APIServices api = APIClient.getClient(LoginActivity.this).create(APIServices.class);

                            // Nếu là Housekeeper
                            if (roleID == 1) {
                                Call<Housekeeper> housekeeperCall = api.getHousekeeperByAccountID(accountID);
                                housekeeperCall.enqueue(new Callback<Housekeeper>() {
                                    @Override
                                    public void onResponse(Call<Housekeeper> call, Response<Housekeeper> response) {
                                        if (response.isSuccessful()) {
                                            Housekeeper housekeeper = response.body();
                                            if (housekeeper != null) {
                                                int housekeeperID = housekeeper.getHousekeeperID();
                                                SharedPreferences.Editor editor = sharedPreferences.edit();
                                                editor.putInt("housekeeperID", housekeeperID);
                                                editor.apply();

                                                Toast.makeText(LoginActivity.this, "Welcome " + uName, Toast.LENGTH_SHORT).show();
                                                Intent intent = new Intent(LoginActivity.this, HomeHousekeeperActivity.class);
                                                startActivity(intent);
                                                finish();
                                            }
                                        } else {
                                            loginBtn.setEnabled(true);
                                            Toast.makeText(LoginActivity.this, "Lấy thông tin housekeeper thất bại", Toast.LENGTH_SHORT).show();
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<Housekeeper> call, Throwable t) {
                                        loginBtn.setEnabled(true);
                                        Toast.makeText(LoginActivity.this, "Lỗi kết nối housekeeper: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                                    }
                                });

                                // Nếu là Family
                            } else if (roleID == 2) {
                                Toast.makeText(LoginActivity.this, "Welcome " + uName, Toast.LENGTH_SHORT).show();
                                Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                                startActivity(intent);
                                finish();
                            }
                        }
                    } else {
                        loginBtn.setEnabled(true);
                        Toast.makeText(LoginActivity.this, "Email hoặc mật khẩu sai!" , Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<Account> call, Throwable t) {
                    loginBtn.setEnabled(true);
                    Toast.makeText(LoginActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });

        });

    }
    @Override
    protected void onStart() {
        super.onStart();

        // Check if user is logged in
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        boolean isLoggedIn = prefs.getBoolean("isLoggedIn", false);
        int roleID = prefs.getInt("roleID", 0);
        String name = prefs.getString("name", "");
        String token = prefs.getString("token", "");
        SharedPreferences.Editor editor = prefs.edit();

        if(!token.isEmpty()){
            JWT jwt = new JWT(token);
            boolean isExpired = jwt.isExpired(2);
            if(isExpired){
                editor.clear();
                editor.apply();
                Toast.makeText(LoginActivity.this, "Phiên đăng nhập hết hạn! Hãy đăng nhập lại!", Toast.LENGTH_SHORT).show();
                return;
            }
        }

        if (isLoggedIn) {
            if(roleID ==1){
                Toast.makeText(LoginActivity.this, "Welcome " + name, Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(LoginActivity.this, HomeHousekeeperActivity.class);
                startActivity(intent);
                finish();
            }else if(roleID ==2){
                Toast.makeText(LoginActivity.this, "Welcome " + name, Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                startActivity(intent);
                finish();
            }
        }
    }

    }