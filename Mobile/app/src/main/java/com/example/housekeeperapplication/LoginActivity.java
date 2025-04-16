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

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.Account;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText emailTxt, passTxt;
    private Button loginBtn;
    private SharedPreferences sharedPreferences;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sharedPreferences = getSharedPreferences("user_prefs", MODE_PRIVATE);

        emailTxt = findViewById(R.id.email);
        passTxt = findViewById(R.id.password);
        loginBtn = findViewById(R.id.loginBTN);

        loginBtn.setOnClickListener(v -> {
            String email = emailTxt.getText().toString();
            String password = passTxt.getText().toString();

            if(email.isEmpty()|| password.isEmpty()){
                Toast.makeText(LoginActivity.this, "Input blank!", Toast.LENGTH_SHORT).show();
                return;
            }

            loginBtn.setEnabled(false);

            APIServices api = APIClient.getClient().create(APIServices.class);
            Call<Account> call = api.login(email, password);
            if(call == null){
                Toast.makeText(LoginActivity.this, "Incorrect email or password", Toast.LENGTH_SHORT).show();
                return;
            }
            call.enqueue(new Callback<Account>() {
                @Override
                public void onResponse(Call<Account> call, Response<Account> response) {
                    // Re-enable the button after the response
                    loginBtn.setEnabled(true);

                    if (response.isSuccessful()) {
                        Account acc = response.body();
                        if (acc != null) {
                            int accountID = acc.getAccountID();
                            String uEmail = acc.getEmail();
                            String uToken = acc.getToken();
                            String uName = acc.getName();
                            int roleID = acc.getRoleID();

                            // Save data to SharedPreferences
                            SharedPreferences.Editor editor = sharedPreferences.edit();
                            editor.putInt("accountID", accountID);
                            editor.putString("email", uEmail);
                            editor.putString("token", uToken);
                            editor.putInt("roleID", roleID);
                            editor.putString("name", uName);
                            editor.apply();

                            Toast.makeText(LoginActivity.this, "Login successful!\nWelcome " + uName, Toast.LENGTH_SHORT).show();

                            // Navigate to the next activity if needed
                            if(roleID == 1){
                                Intent intent = new Intent(LoginActivity.this, HomeHousekeeperActivity.class);
                                startActivity(intent);
                                finish(); // Close the LoginActivity
                            }
                            if(roleID == 2){
                                Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                                startActivity(intent);
                                finish(); // Close the LoginActivity
                            }
                        }
                    } else {
                        Toast.makeText(LoginActivity.this, "Login failed: " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<Account> call, Throwable t) {
                    // Re-enable the button on failure
                    loginBtn.setEnabled(true);
                    Toast.makeText(LoginActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        });
    }

    }