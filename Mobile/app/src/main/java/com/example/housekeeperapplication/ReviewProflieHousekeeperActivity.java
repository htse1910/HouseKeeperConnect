package com.example.housekeeperapplication;


import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RatingBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;


import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.bumptech.glide.Glide;
import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.HouseKeeperSkillDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperSkillMappingDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.RatingDisplayDTO;


import java.util.List;
import java.util.Locale;


import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class ReviewProflieHousekeeperActivity extends AppCompatActivity {

    private ImageView ivAvatar;
    private TextView tvName, tvGender, tvAddress, tvEmail, tvPhone, tvDescription;
    private RatingBar ratingBar;
    private LinearLayout layoutSkills, layoutReviews;
    private APIServices api;
    private int housekeeperAccountID;
    private int housekeeperID;
    private ProgressBar progressBar;
    private ScrollView mainContent;
    private Button btnMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review_proflie_housekeeper);
        housekeeperAccountID = getIntent().getIntExtra("housekeeperAccountID", -1);
        if (housekeeperAccountID == -1) {
            Toast.makeText(this, "Không tìm thấy thông tin người giúp việc", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        api = APIClient.getClient(this).create(APIServices.class);
        initViews();
        loadHousekeeperData();
    }

    private void initViews() {
        ivAvatar = findViewById(R.id.ivAvatar);
        tvName = findViewById(R.id.tvName);
        tvGender = findViewById(R.id.tvGender);
        tvAddress = findViewById(R.id.tvAddress);
        tvEmail = findViewById(R.id.tvEmail);
        tvPhone = findViewById(R.id.tvPhone);
        tvDescription = findViewById(R.id.tvDescription);
        ratingBar = findViewById(R.id.ratingBar);
        layoutSkills = findViewById(R.id.layoutSkills);
        layoutReviews = findViewById(R.id.layoutReviews);
        progressBar = findViewById(R.id.progressBar);
        mainContent = findViewById(R.id.mainContent);
        btnMessage = findViewById(R.id.btnMessage);
    }

    private void showLoading(boolean show) {
        progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
        mainContent.setVisibility(show ? View.GONE : View.VISIBLE);
    }

    private void loadHousekeeperData() {
        showLoading(true);

        api.getHousekeeperByAccountID(housekeeperAccountID).enqueue(new Callback<Housekeeper>() {
            @Override
            public void onResponse(Call<Housekeeper> call, Response<Housekeeper> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Housekeeper housekeeper = response.body();
                    housekeeperID = housekeeper.getHousekeeperID();
                    updateHousekeeperInfo(housekeeper);

                    // Load các dữ liệu khác
                    loadAccountInfo();
                    loadSkills();
                    loadRatings();
                } else {
                    showLoading(false);
                    Toast.makeText(ReviewProflieHousekeeperActivity.this,
                            "Không tải được thông tin", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Housekeeper> call, Throwable t) {
                showLoading(false);
                Toast.makeText(ReviewProflieHousekeeperActivity.this,
                        "Lỗi kết nối", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private int apiCounter = 0;
    private final int TOTAL_API_CALLS = 3;

    private void updateHousekeeperInfo(Housekeeper housekeeper) {
        tvName.setText(housekeeper.getName());
        tvGender.setText("Giới tính: " + (housekeeper.getGender() == 1 ? "Nam" : "Nữ"));
        tvAddress.setText("Địa chỉ: " + housekeeper.getAddress());
        tvDescription.setText(housekeeper.getIntroduction());

        // Load avatar
        String avatarUrl = housekeeper.getGoogleProfilePicture() != null ?
                housekeeper.getGoogleProfilePicture() : housekeeper.getLocalProfilePicture();
        if (avatarUrl != null && !avatarUrl.isEmpty()) {
            Glide.with(this)
                    .load(avatarUrl)
                    .circleCrop()
                    .into(ivAvatar);
        }

    }

    private void loadAccountInfo() {
        apiCounter++;
        api.getAccountById(housekeeperAccountID).enqueue(new Callback<Account>() {
            @Override
            public void onResponse(Call<Account> call, Response<Account> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Account account = response.body();
                    tvEmail.setText(account.getEmail());
                    tvPhone.setText(account.getPhone());
                }
                checkAllApiCompleted();
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                checkAllApiCompleted();
            }
        });
    }

    private void loadSkills() {
        apiCounter++;
        api.getSkillsByAccountId(housekeeperAccountID).enqueue(new Callback<List<HousekeeperSkillMappingDisplayDTO>>() {
            @Override
            public void onResponse(Call<List<HousekeeperSkillMappingDisplayDTO>> call,
                                   Response<List<HousekeeperSkillMappingDisplayDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (HousekeeperSkillMappingDisplayDTO skillMapping : response.body()) {
                        loadSkillName(skillMapping.getHouseKeeperSkillID());
                    }
                } else {
                    addSkillToLayout("Chưa có thông tin kỹ năng");
                }
                checkAllApiCompleted();
            }

            @Override
            public void onFailure(Call<List<HousekeeperSkillMappingDisplayDTO>> call, Throwable t) {
                addSkillToLayout("Lỗi tải kỹ năng");
                checkAllApiCompleted();
            }
        });
    }

    private void loadSkillName(int skillId) {
        api.getHousekeeperSkillById(skillId).enqueue(new Callback<HouseKeeperSkillDisplayDTO>() {
            @Override
            public void onResponse(Call<HouseKeeperSkillDisplayDTO> call,
                                   Response<HouseKeeperSkillDisplayDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    addSkillToLayout(response.body().getName());
                }
            }

            @Override
            public void onFailure(Call<HouseKeeperSkillDisplayDTO> call, Throwable t) {
                addSkillToLayout("Kỹ năng ID: " + skillId);
            }
        });
    }

    private void addSkillToLayout(String skillName) {
        runOnUiThread(() -> {
            TextView skillView = new TextView(this);
            skillView.setText("• " + skillName);
            skillView.setTextSize(16);
            skillView.setPadding(0, 8, 0, 8);
            layoutSkills.addView(skillView);
        });
    }


    private void loadRatings() {
        apiCounter++;
        api.getRatingsByHK(housekeeperID, 1, 100).enqueue(new Callback<List<RatingDisplayDTO>>() {
            @Override
            public void onResponse(Call<List<RatingDisplayDTO>> call,
                                   Response<List<RatingDisplayDTO>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    for (RatingDisplayDTO rating : response.body()) {
                        loadFamilyInfo(rating);
                    }
                } else {
                    addNoRatingView();
                }
                checkAllApiCompleted();
            }

            @Override
            public void onFailure(Call<List<RatingDisplayDTO>> call, Throwable t) {
                addNoRatingView();
                checkAllApiCompleted();
            }
        });
    }

    private void checkAllApiCompleted() {
        if (--apiCounter == 0) {
            showLoading(false);
        }
    }
    private void loadFamilyInfo(RatingDisplayDTO rating) {
        // Bước 1: Lấy thông tin family từ familyID
        api.getFamilyByID(rating.getFamilyID()).enqueue(new Callback<FamilyAccountMappingDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountMappingDTO> call,
                                   Response<FamilyAccountMappingDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Bước 2: Lấy thông tin account từ accountID của family
                    loadAccountName(response.body().accountID, rating);
                } else {
                    addRatingView(rating, "Người đánh giá #" + rating.getFamilyID());
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountMappingDTO> call, Throwable t) {
                addRatingView(rating, "Người đánh giá #" + rating.getFamilyID());
            }
        });
    }

    private void loadAccountName(int accountId, RatingDisplayDTO rating) {
        api.getAccountById(accountId).enqueue(new Callback<Account>() {
            @Override
            public void onResponse(Call<Account> call, Response<Account> response) {
                String reviewerName = "Người đánh giá";
                if (response.isSuccessful() && response.body() != null) {
                    reviewerName = response.body().getName();
                }
                addRatingView(rating, reviewerName);
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                addRatingView(rating, "Người đánh giá #" + rating.getFamilyID());
            }
        });
    }

    private void addRatingView(RatingDisplayDTO rating, String reviewerName) {
        runOnUiThread(() -> {
            View reviewView = LayoutInflater.from(this).inflate(R.layout.item_review, layoutReviews, false);

            TextView tvReviewer = reviewView.findViewById(R.id.tvReviewer);
            TextView tvDate = reviewView.findViewById(R.id.tvDate);
            RatingBar rbRating = reviewView.findViewById(R.id.rbRating);
            TextView tvComment = reviewView.findViewById(R.id.tvComment);

            tvReviewer.setText(reviewerName);
            tvDate.setText(formatDate(rating.getCreateAt()));
            rbRating.setRating(rating.getScore());
            tvComment.setText(rating.getContent());

            layoutReviews.addView(reviewView);
        });
    }

    private void addNoRatingView() {
        runOnUiThread(() -> {
            TextView noReviewText = new TextView(this);
            noReviewText.setText("Chưa có đánh giá nào");
            noReviewText.setTextSize(16);
            noReviewText.setPadding(0, 16, 0, 16);
            layoutReviews.addView(noReviewText);
        });
    }

    private String formatDate(String rawDate) {
        try {
            if (rawDate.contains("T")) {
                return rawDate.split("T")[0];
            }
            return rawDate;
        } catch (Exception e) {
            return rawDate;
        }
    }


}