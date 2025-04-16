package com.example.housekeeperapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class Register extends AppCompatActivity {

    private EditText nameTxt, emailTxt, passTxt, rePassTxt, bankNumTxt,
                     phoneTxt, addressTxt, nicknameTxt;
    private RadioGroup accTypeRadio, genTypeRadio;
    private RadioButton hkRb, maleRb;

    private int genderID, roleID;
    private LinearLayout regBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_register);

        nameTxt = findViewById(R.id.reg_full_name);
        emailTxt = findViewById(R.id.reg_email);
        passTxt = findViewById(R.id.reg_password);
        rePassTxt = findViewById(R.id.reg_confirm_password);
        bankNumTxt = findViewById(R.id.reg_bank_account);
        phoneTxt = findViewById(R.id.reg_phone);
        addressTxt = findViewById(R.id.reg_address);
        nicknameTxt = findViewById(R.id.reg_nickname);

        regBtn = findViewById(R.id.regBtn);

        hkRb = findViewById(R.id.reg_rb_housekeeper);
        maleRb = findViewById(R.id.reg_rb_male);

        //Default selected options
        maleRb.setChecked(true);
        hkRb.setChecked(true);

        accTypeRadio = findViewById(R.id.reg_account_type);
        genTypeRadio = findViewById(R.id.reg_gender_group);
        accTypeRadio.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if(checkedId== R.id.reg_rb_housekeeper){
                    roleID = 1;
                }else if(checkedId == R.id.reg_rb_family){
                    roleID = 2;
                }else{
                    Toast.makeText(Register.this, "Vai trò không phù hợp! Hãy chọn lại!", Toast.LENGTH_SHORT).show();
                }
                Toast.makeText(Register.this, "Đã chọn: "+roleID, Toast.LENGTH_SHORT).show();
            }
        });
        genTypeRadio.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if(checkedId== R.id.reg_rb_male){
                    genderID = 1;
                }else if(checkedId == R.id.reg_rb_female){
                    genderID = 2;
                }else{
                    Toast.makeText(Register.this, "Giới tính không phù hợp! Hãy chọn lại!", Toast.LENGTH_SHORT).show();
                }

                Toast.makeText(Register.this, "Đã chọn: "+genderID, Toast.LENGTH_SHORT).show();
            }
        });



        regBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = nameTxt.getText().toString();
                String email = emailTxt.getText().toString();
                String pass = passTxt.getText().toString();
                String rePass = rePassTxt.getText().toString();
                int bankNum = Integer.parseInt(bankNumTxt.getText().toString());
                int phone = Integer.parseInt(phoneTxt.getText().toString());
                String address = addressTxt.getText().toString();
                String nickname = nicknameTxt.getText().toString();

                if(!pass.equals(rePass)){
                    Toast.makeText(Register.this,"Mật khẩu không khớp nhau!", Toast.LENGTH_SHORT).show();
                    return;
                }

                
            }
        });

    }
}