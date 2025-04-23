package com.example.housekeeperapplication.profile;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.example.housekeeperapplication.R;
import com.squareup.picasso.Picasso;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EditHousekeeperProfile extends AppCompatActivity {
    private static final String TAG = "EditHousekeeperProfile";
    private static final int PICK_IMAGE_REQUEST = 1;
    private Uri imageUri;
    private ImageView profilePicture;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_housekeeper_profile);

        profilePicture = findViewById(R.id.edhkProfilePicture);
        Button btnSave = findViewById(R.id.btnSaveProfileFamily);
        Button btnSelectImage = findViewById(R.id.btnSelectImage);

        // Load current profile data
        loadCurrentProfile();

        // Set up image selection
        btnSelectImage.setOnClickListener(v -> openImageChooser());

        // Set up save button
        btnSave.setOnClickListener(v -> {
            if (validateInput()) {
                updateProfile();
            }
        });
    }

    private void openImageChooser() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Picture"), PICK_IMAGE_REQUEST);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            imageUri = data.getData();
            profilePicture.setImageURI(imageUri);
        }
    }

    private boolean validateInput() {
        EditText edFullName = findViewById(R.id.edhkFullName);
        EditText edPhone = findViewById(R.id.edhkPhone);

        if (edFullName.getText().toString().trim().isEmpty()) {
            Toast.makeText(this, "Vui lòng nhập họ tên", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (edPhone.getText().toString().trim().isEmpty()) {
            Toast.makeText(this, "Vui lòng nhập số điện thoại", Toast.LENGTH_SHORT).show();
            return false;
        }

        return true;
    }

    private void updateProfile() {

        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);

        // Get data from form
        String fullName = ((EditText) findViewById(R.id.edhkFullName)).getText().toString();
        String phone = ((EditText) findViewById(R.id.edhkPhone)).getText().toString();
        String address = ((EditText) findViewById(R.id.edhkAddress)).getText().toString();
        String bankAccountNumber = ((EditText) findViewById(R.id.edhkBank)).getText().toString();
        String bankAccountName = ((EditText) findViewById(R.id.edhkBankName)).getText().toString();
        String introduction = ((EditText) findViewById(R.id.edhkDescription)).getText().toString();
        String nickname = ((EditText) findViewById(R.id.edhkNickname)).getText().toString();

        Spinner genderSpinner = findViewById(R.id.edhkGender);
        int genderValue = genderSpinner.getSelectedItemPosition() + 1; // Convert to 1=Male, 2=Female

        Spinner workTypeSpinner = findViewById(R.id.edhkWorkType);
        int workTypeValue = workTypeSpinner.getSelectedItemPosition() + 1; // Convert to 1=Fulltime, 2=PartTime

        // Prepare image file (if selected)
        MultipartBody.Part imagePart = null;
        if (imageUri != null) {
            try {
                InputStream inputStream = getContentResolver().openInputStream(imageUri);
                RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), getBytes(inputStream));
                imagePart = MultipartBody.Part.createFormData("LocalProfilePicture", "profile.jpg", requestFile);
            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(this, "Lỗi khi chọn ảnh", Toast.LENGTH_SHORT).show();
                return;
            }
        }

        // Create RequestBody for all fields
        RequestBody accountIdBody = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(accountId));
        RequestBody nameBody = RequestBody.create(MediaType.parse("text/plain"), fullName);
        RequestBody phoneBody = RequestBody.create(MediaType.parse("text/plain"), phone);
        RequestBody workTypeBody = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(workTypeValue));
        RequestBody bankAccountNumberBody = RequestBody.create(MediaType.parse("text/plain"), bankAccountNumber);
        RequestBody bankAccountNameBody = RequestBody.create(MediaType.parse("text/plain"), bankAccountName);
        RequestBody introductionBody = RequestBody.create(MediaType.parse("text/plain"), introduction);
        RequestBody addressBody = RequestBody.create(MediaType.parse("text/plain"), address);
        RequestBody genderBody = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(genderValue));
        RequestBody nicknameBody = RequestBody.create(MediaType.parse("text/plain"), nickname);

        // Call API
        APIServices api = APIClient.getClient(this).create(APIServices.class);
        Call<ResponseBody> call = api.updateHousekeeper(
                accountIdBody,
                nameBody,
                phoneBody,
                workTypeBody,
                bankAccountNumberBody,
                bankAccountNameBody,
                introductionBody,
                addressBody,
                genderBody,
                nicknameBody,
                imagePart
        );
        if (call == null){Toast.makeText(EditHousekeeperProfile.this,
                "khong goi dc api!" ,
                Toast.LENGTH_LONG).show();}
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(EditHousekeeperProfile.this, "Cập nhật thành công", Toast.LENGTH_SHORT).show();
                    // Update local profile picture if changed
                    if (imageUri != null) {
                        SharedPreferences.Editor editor = prefs.edit();
                        editor.putString("profileImageUri", imageUri.toString());
                        editor.apply();
                    }
                    finish();
                } else {
                    try {
                        // Đọc thông báo lỗi từ response
                        Log.e("API_ERROR", response.errorBody().string());
                        Toast.makeText(EditHousekeeperProfile.this,
                                "Cập nhật thất bại: " + response.code() + " - " + response.errorBody().string(),
                                Toast.LENGTH_LONG).show();

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.e("API_ERROR", t.getMessage().toString());
                Toast.makeText(EditHousekeeperProfile.this, "Lỗi mạng: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private byte[] getBytes(InputStream inputStream) throws IOException {
        ByteArrayOutputStream byteBuffer = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int len;
        while ((len = inputStream.read(buffer)) != -1) {
            byteBuffer.write(buffer, 0, len);
        }
        return byteBuffer.toByteArray();
    }

    private void loadCurrentProfile() {
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);

        // Load account info
        APIServices api = APIClient.getClient(this).create(APIServices.class);
        Call<Account> accountCall = api.getAccountById(accountId);
        accountCall.enqueue(new Callback<Account>() {
            @Override
            public void onResponse(Call<Account> call, Response<Account> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Account account = response.body();
                    // Set account fields
                    ((EditText) findViewById(R.id.edhkFullName)).setText(account.getName());
                    ((EditText) findViewById(R.id.edhkPhone)).setText(account.getPhone());
                    ((EditText) findViewById(R.id.edhkAddress)).setText(account.getAddress());
                    ((EditText) findViewById(R.id.edhkBank)).setText(account.getBankAccountNumber());
                    ((EditText) findViewById(R.id.edhkBankName)).setText(account.getBankAccountName());
                    ((EditText) findViewById(R.id.edhkDescription)).setText(account.getIntroduction());
                    ((EditText) findViewById(R.id.edhkNickname)).setText(account.getNickname());

                    // Set gender (1=Male, 2=Female)
                    Spinner genderSpinner = findViewById(R.id.edhkGender);
                    int genderPosition = account.getGender() - 1;
                    genderSpinner.setSelection(genderPosition >= 0 ? genderPosition : 0);

                    // Load profile picture
                    String imgUrl = account.getLocalProfilePicture() != null ?
                            account.getLocalProfilePicture() : account.getGoogleProfilePicture();
                    if (imgUrl != null && !imgUrl.isEmpty()) {
                        Picasso.get().load(imgUrl).into(profilePicture);
                    }

                    // Load housekeeper-specific data (workType)
                    loadHousekeeperData(accountId);
                }
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                Toast.makeText(EditHousekeeperProfile.this, "Lỗi tải thông tin tài khoản", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void loadHousekeeperData(int accountId) {
        APIServices api = APIClient.getClient(this).create(APIServices.class);
        Call<Housekeeper> hkCall = api.getHousekeeperByAccountID(accountId);
        hkCall.enqueue(new Callback<Housekeeper>() {
            @Override
            public void onResponse(Call<Housekeeper> call, Response<Housekeeper> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Housekeeper housekeeper = response.body();
                    // Set work type (1=Fulltime, 2=PartTime)
                    Spinner workTypeSpinner = findViewById(R.id.edhkWorkType);
                    int workTypePosition = housekeeper.getWorkType() - 1;
                    workTypeSpinner.setSelection(workTypePosition >= 0 ? workTypePosition : 0);
                }
            }

            @Override
            public void onFailure(Call<Housekeeper> call, Throwable t) {
                Toast.makeText(EditHousekeeperProfile.this, "Lỗi tải thông tin housekeeper", Toast.LENGTH_SHORT).show();
            }
        });
    }
}