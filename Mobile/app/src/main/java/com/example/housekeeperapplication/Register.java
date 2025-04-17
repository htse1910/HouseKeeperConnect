package com.example.housekeeperapplication;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;

import java.io.File;

import io.appwrite.Client;
import io.appwrite.services.Storage;
import okhttp3.MediaType;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;


public class Register extends AppCompatActivity {

    private EditText nameTxt, emailTxt, passTxt, rePassTxt, bankNumTxt,
                     phoneTxt, addressTxt, nicknameTxt, introduceTxt;
    private RadioGroup accTypeRadio, genTypeRadio;
    private RadioButton hkRb, maleRb;

    private int genderID, roleID;
    private LinearLayout pictBtn, regBtn;
    private static final int PICK_IMAGE = 1;
    private String imageUrl;
    private ImageView imageView;
    private  Uri imageUri;

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
        introduceTxt = findViewById(R.id.reg_description);
        imageView = findViewById(R.id.reg_image_view);

        pictBtn = findViewById(R.id.reg_upload_image);
        regBtn = findViewById(R.id.regBtn);

        hkRb = findViewById(R.id.reg_rb_housekeeper);
        maleRb = findViewById(R.id.reg_rb_male);

        //Default selected options
        maleRb.setChecked(true);
        roleID = 1;
        genderID = 1;
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

        //Select & Process picture from external

        pictBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                startActivityForResult(intent, PICK_IMAGE);
            }
        });

        regBtn.setEnabled(true);

        regBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = nameTxt.getText().toString();
                String email = emailTxt.getText().toString();
                String pass = passTxt.getText().toString();
                String rePass = rePassTxt.getText().toString();
                String bankNum = bankNumTxt.getText().toString();
                String phone = phoneTxt.getText().toString();
                String address = addressTxt.getText().toString();
                String nickname = nicknameTxt.getText().toString();
                String introduce = introduceTxt.getText().toString();
                regBtn.setEnabled(false);


                // Create a request body from the file
                File file = new File(imageUrl);
                RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"),file);


                // Create MultipartBody.Part for the image
                MultipartBody.Part imageBody = MultipartBody.Part.createFormData("localProfilePicture", file.getName(), requestFile);

                RequestBody nameBody = RequestBody.create(MediaType.parse("text/plain"), name);
                RequestBody emailBody = RequestBody.create(MediaType.parse("text/plain"), email);
                RequestBody passwordBody = RequestBody.create(MediaType.parse("text/plain"), pass);
                RequestBody bankNumBody = RequestBody.create(MediaType.parse("text/plain"), bankNum);
                RequestBody phoneBody = RequestBody.create(MediaType.parse("text/plain"), phone);
                RequestBody roleIDBody = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(roleID));
                RequestBody descriptionBody = RequestBody.create(MediaType.parse("text/plain"), introduce);
                RequestBody addressBody = RequestBody.create(MediaType.parse("text/plain"), address);
                RequestBody genderBody = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(genderID));
                RequestBody nicknameBody = RequestBody.create(MediaType.parse("text/plain"), nickname);

                if(!pass.equals(rePass)){
                    Toast.makeText(Register.this,"Mật khẩu không khớp nhau!", Toast.LENGTH_SHORT).show();
                    return;
                }



                APIServices api = APIClient.getClient().create(APIServices.class);
                Call<ResponseBody> call = api.register(nameBody, emailBody, passwordBody, bankNumBody, phoneBody, roleIDBody, descriptionBody, addressBody, genderBody, nicknameBody, imageBody);
                if(call == null){
                    Toast.makeText(Register.this, "Incorrect email or password", Toast.LENGTH_SHORT).show();
                    return;
                }
                call.enqueue(new Callback<ResponseBody>() {

                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        if(response.isSuccessful()){
                            regBtn.setEnabled(true);
                            Toast.makeText(Register.this, "Tạo tài khoản thành công!", Toast.LENGTH_SHORT).show();
                            Intent loginIntent = new Intent(Register.this, LoginActivity.class);
                            startActivity(loginIntent);
                            finish();
                        }else{

                            Toast.makeText(Register.this, "Không thể tạo tài khoản!\n Lỗi: "+response.message(), Toast.LENGTH_SHORT).show();
                            regBtn.setEnabled(true);
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        Toast.makeText(Register.this, "Không thể tạo tài khoản!\n Lỗi: "+t.getMessage(), Toast.LENGTH_SHORT).show();
                        regBtn.setEnabled(true);
                    }
                });
            }
        });


    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE && resultCode == RESULT_OK && data != null) {
            imageUri = data.getData();
            imageUrl = getRealPathFromURI(imageUri);
            imageView.setImageURI(imageUri);
        }
    }

    public String getRealPathFromURI(Uri uri) {
        String[] projection = { MediaStore.Images.Media.DATA };
        Cursor cursor = getContentResolver().query(uri, projection, null, null, null);
        if (cursor != null) {
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            String path = cursor.getString(column_index);
            cursor.close();
            return path;
        }
        return null;
    }

}