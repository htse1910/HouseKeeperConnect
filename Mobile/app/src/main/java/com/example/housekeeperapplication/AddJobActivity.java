package com.example.housekeeperapplication;

import android.app.DatePickerDialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ExpandableListView;
import android.widget.GridLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.content.ContextCompat;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ServiceExpandableAdapter;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.FeeDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.JobCreateDTO;
import com.example.housekeeperapplication.Model.JobType;
import com.example.housekeeperapplication.Model.Service;
import com.example.housekeeperapplication.Model.Wallet;
import com.google.gson.Gson;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddJobActivity extends AppCompatActivity {

    private ExpandableListView expandableListView;
    private ServiceExpandableAdapter adapter;
    private ProgressDialog progressDialog;
    private List<Integer> selectedSlotIds = new ArrayList<>();
    private List<Integer> selectedDayOfWeek = new ArrayList<>();
    private JobType selectedJobType = JobType.FULL_TIME;
    private List<Service> selectedServices = new ArrayList<>();

    private TextView tvCalculationDetails, tvBaseSalary, tvPlatformFeeLabel, tvPlatformFee, tvTotalSalary, tvBalanceWarning;
    private LinearLayout layoutSelectedServices;
    private CardView cvPriceSummary;
    private LinearLayout layoutWarningContainer;
    private ScrollView scrollView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_job);

        initializeViews();
        setupJobTypeSpinner();
        setupDatePickers();
        setupWorkingDaysCheckboxes();
        setupWorkingTimeCheckboxes();
        loadServices();

        Button btnSubmit = findViewById(R.id.btnSubmit);
        btnSubmit.setOnClickListener(v -> onSubmit());

        Button btnCancel = findViewById(R.id.btnCancel);
        btnCancel.setOnClickListener(v -> finish());
    }

    private void initializeViews() {
        expandableListView = findViewById(R.id.expandableListViewJobTypes);
        tvCalculationDetails = findViewById(R.id.tvCalculationDetails);
        tvBaseSalary = findViewById(R.id.tvBaseSalary);
        tvPlatformFeeLabel = findViewById(R.id.tvPlatformFeeLabel);
        tvPlatformFee = findViewById(R.id.tvPlatformFee);
        tvTotalSalary = findViewById(R.id.tvTotalSalary);
        tvBalanceWarning = findViewById(R.id.tvBalanceWarning);
        layoutSelectedServices = findViewById(R.id.layoutSelectedServices);
        cvPriceSummary = findViewById(R.id.cvPriceSummary);
        layoutWarningContainer = findViewById(R.id.layoutWarningContainer);
        // Initially hide price summary
        cvPriceSummary.setVisibility(View.GONE);
        tvBalanceWarning.setVisibility(View.GONE);
        scrollView = findViewById(R.id.scrollView);
    }

    private void setupJobTypeSpinner() {
        Spinner spinner = findViewById(R.id.spinnerJobType);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedJobType = position == 0 ? JobType.FULL_TIME : JobType.PART_TIME;
                calculateAndDisplayPrice(); // Update price when job type changes
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
            }
        });
    }

    private void setupDatePickers() {
        EditText edtStartDate = findViewById(R.id.edtStartDate);
        EditText edtEndDate = findViewById(R.id.edtEndDate);

        edtStartDate.setOnClickListener(v -> showDatePicker(edtStartDate));
        edtEndDate.setOnClickListener(v -> showDatePicker(edtEndDate));

        // Add text watchers to update price when dates change
        edtStartDate.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                calculateAndDisplayPrice();
            }
        });

        edtEndDate.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {}

            @Override
            public void afterTextChanged(Editable s) {
                calculateAndDisplayPrice();
            }
        });
    }

    private void showDatePicker(EditText editText) {
        Calendar calendar = Calendar.getInstance();
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                this,
                (view, year, month, dayOfMonth) -> {
                    String selectedDate = String.format("%02d/%02d/%04d", dayOfMonth, month + 1, year);
                    editText.setText(selectedDate);
                    calculateAndDisplayPrice();
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
        );
        datePickerDialog.show();
    }

    private void setupWorkingDaysCheckboxes() {
        LinearLayout daysLayout = findViewById(R.id.layoutWorkingDays);
        for (int i = 0; i < daysLayout.getChildCount(); i++) {
            CheckBox cb = (CheckBox) daysLayout.getChildAt(i);
            final int dayOfWeek = i; // CN=0, T2=1, T3=2,..., T7=6

            cb.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    selectedDayOfWeek.add(dayOfWeek);
                } else {
                    selectedDayOfWeek.remove(Integer.valueOf(dayOfWeek));
                }
                calculateAndDisplayPrice();
            });
        }
    }

    private void setupWorkingTimeCheckboxes() {
        GridLayout timeGrid = findViewById(R.id.layoutWorkingTime);
        for (int i = 0; i < timeGrid.getChildCount(); i++) {
            CheckBox cb = (CheckBox) timeGrid.getChildAt(i);
            final int slotId = i + 1; // Giả sử slotID bắt đầu từ 1

            cb.setOnCheckedChangeListener((buttonView, isChecked) -> {
                if (isChecked) {
                    selectedSlotIds.add(slotId);
                } else {
                    selectedSlotIds.remove(Integer.valueOf(slotId));
                }
                calculateAndDisplayPrice();
            });
        }
    }

    private void showLoading() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("Đang xử lý...");
        progressDialog.setCancelable(false);
        progressDialog.show();
    }

    private void dismissLoading() {
        if (progressDialog != null && progressDialog.isShowing()) {
            progressDialog.dismiss();
        }
    }

    private void loadServices() {
        showLoading();

        APIServices apiService = APIClient.getClient(this).create(APIServices.class);
        Call<List<Service>> call = apiService.getServiceList();

        call.enqueue(new Callback<List<Service>>() {
            @Override
            public void onResponse(Call<List<Service>> call, Response<List<Service>> response) {
                dismissLoading();

                if (response.isSuccessful() && response.body() != null) {
                    List<Service> services = response.body();
                    setupExpandableListView(services);
                } else {
                    Toast.makeText(AddJobActivity.this, "Không có dịch vụ nào", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Service>> call, Throwable t) {
                dismissLoading();
                Toast.makeText(AddJobActivity.this, "Lỗi: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupExpandableListView(List<Service> services) {
        if (services == null || services.isEmpty()) {
            Toast.makeText(this, "Không có dịch vụ nào", Toast.LENGTH_SHORT).show();
            return;
        }

        adapter = new ServiceExpandableAdapter(this, services, newHeight -> {
            ViewGroup.LayoutParams params = expandableListView.getLayoutParams();
            params.height = newHeight;
            expandableListView.setLayoutParams(params);
        });

        // Set listener for service selection changes
        adapter.setOnServiceSelectionChangeListener(selected -> {
            selectedServices.clear();
            selectedServices.addAll(selected);
            updateServiceListAndCalculatePrice();
        });

        expandableListView.setAdapter(adapter);

        expandableListView.setOnGroupExpandListener(groupPosition -> {
            int newHeight = adapter.calculateTotalHeight(expandableListView);
            ViewGroup.LayoutParams params = expandableListView.getLayoutParams();
            params.height = newHeight;
            expandableListView.setLayoutParams(params);
        });

        expandableListView.setOnGroupCollapseListener(groupPosition -> {
            int newHeight = adapter.calculateTotalHeight(expandableListView);
            ViewGroup.LayoutParams params = expandableListView.getLayoutParams();
            params.height = newHeight;
            expandableListView.setLayoutParams(params);
        });

        // Expand all groups initially
        for (int i = 0; i < adapter.getGroupCount(); i++) {
            expandableListView.expandGroup(i);
        }
    }

    private void updateServiceListAndCalculatePrice() {
        layoutSelectedServices.removeAllViews();

        if (selectedServices.isEmpty()) {
            cvPriceSummary.setVisibility(View.GONE);// Ẩn CardView khi không có dịch vụ
            return;
        }

        cvPriceSummary.setVisibility(View.VISIBLE); // Hiện CardView khi có dịch vụ

        // Add selected services to the list
        for (Service service : selectedServices) {
            addServiceItemView(service);
        }

        calculateAndDisplayPrice();
    }

    private void addServiceItemView(Service service) {
        View serviceItemView = getLayoutInflater().inflate(R.layout.item_selected_service, null);

        TextView tvServiceName = serviceItemView.findViewById(R.id.tvServiceName);
        TextView tvServicePrice = serviceItemView.findViewById(R.id.tvServicePrice);

        tvServiceName.setText(service.getServiceName());
        tvServicePrice.setText(String.format(Locale.getDefault(), "%,d VNĐ", (int)service.getPrice()));

        layoutSelectedServices.addView(serviceItemView);
    }

    private void calculateAndDisplayPrice() {
        if (selectedServices.isEmpty() || selectedSlotIds.isEmpty() || selectedDayOfWeek.isEmpty()) {
            resetPriceDisplay();
            return;
        }

        try {
            // Get start and end dates
            EditText edtStartDate = findViewById(R.id.edtStartDate);
            EditText edtEndDate = findViewById(R.id.edtEndDate);

            if (edtStartDate.getText().toString().isEmpty() || edtEndDate.getText().toString().isEmpty()) {
                resetPriceDisplay();
                return;
            }

            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            Date startDate = sdf.parse(edtStartDate.getText().toString());
            Date endDate = sdf.parse(edtEndDate.getText().toString());

            // Calculate total service price
            double totalServicePrice = 0;
            for (Service service : selectedServices) {
                totalServicePrice += service.getPrice();
            }

            // Calculate average price per hour
            double pricePerHour = totalServicePrice / selectedServices.size();

            // Calculate total slots
            int totalSlots = 0;
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);

            while (!calendar.getTime().after(endDate)) {
                int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK) - 1; // Sunday=0, Monday=1, etc.
                if (selectedDayOfWeek.contains(dayOfWeek)) {
                    totalSlots += selectedSlotIds.size();
                }
                calendar.add(Calendar.DAY_OF_YEAR, 1);
            }

            // Calculate total job price
            double totalJobPrice = pricePerHour * totalSlots;

            // Determine platform fee ID based on job type (1 = Full-time, 2 = Part-time)
            int platformFeeID = determinePlatformFeeID();

            // Get platform fee from API
            getPlatformFeeAndCalculate(platformFeeID, totalJobPrice, pricePerHour, totalSlots);

        } catch (ParseException e) {
            e.printStackTrace();
            resetPriceDisplay();
        }
    }
    private int determinePlatformFeeID() {
        return (selectedJobType == JobType.FULL_TIME) ? 1 : 2;
    }
    private void getPlatformFeeAndCalculate(int platformFeeID, double totalJobPrice,
                                            double pricePerHour, int totalSlots) {
        showLoading();

        APIServices apiService = APIClient.getClient(this).create(APIServices.class);
        Call<FeeDisplayDTO> call = apiService.getPlatformFeeByID(platformFeeID);

        call.enqueue(new Callback<FeeDisplayDTO>() {
            @Override
            public void onResponse(Call<FeeDisplayDTO> call, Response<FeeDisplayDTO> response) {
                dismissLoading();

                if (response.isSuccessful() && response.body() != null) {
                    FeeDisplayDTO fee = response.body();
                    double feePercent = fee.getPercent();
                    calculateAndShowPrice(totalJobPrice, feePercent, pricePerHour, totalSlots);
                } else {
                    handleFeeError(platformFeeID, totalJobPrice, pricePerHour, totalSlots,
                            "Không thể lấy thông tin phí từ server");
                }
            }

            @Override
            public void onFailure(Call<FeeDisplayDTO> call, Throwable t) {
                dismissLoading();
                handleFeeError(platformFeeID, totalJobPrice, pricePerHour, totalSlots,
                        "Lỗi kết nối: " + t.getMessage());
            }
        });
    }

    // Xử lý lỗi khi không lấy được phí
    private void handleFeeError(int platformFeeID, double totalJobPrice,
                                double pricePerHour, int totalSlots, String errorMessage) {
        runOnUiThread(() -> {
            Toast.makeText(AddJobActivity.this, errorMessage, Toast.LENGTH_LONG).show();
            // Không tính phí nếu không lấy được từ server
            calculateAndShowPrice(totalJobPrice, 0.0, pricePerHour, totalSlots);
        });
    }

    // Phương thức tính toán và hiển thị giá
    private void calculateAndShowPrice(double totalJobPrice, double feePercent,
                                       double pricePerHour, int totalSlots) {
        double platformFee = totalJobPrice * feePercent;
        double totalAmount = totalJobPrice + platformFee;

        updatePriceUI(totalJobPrice, feePercent, platformFee, totalAmount,
                pricePerHour, totalSlots);
    }

    private void updatePriceUI(double totalJobPrice, double feePercent, double platformFee,
                               double totalAmount, double pricePerHour, int totalSlots) {
        tvBaseSalary.setText(String.format(Locale.getDefault(), "%,d VNĐ", (int)totalJobPrice));
        tvPlatformFeeLabel.setText(String.format(Locale.getDefault(),
                "Phí nền tảng (%.0f%%)", feePercent * 100));
        tvPlatformFee.setText(String.format(Locale.getDefault(), "%,d VNĐ", (int)platformFee));
        tvTotalSalary.setText(String.format(Locale.getDefault(), "%,d VNĐ", (int)totalAmount));

        String calculationDetails = String.format(Locale.getDefault(),
                "• Giá dịch vụ trung bình: %,d VNĐ/giờ\n" +
                        "• Số ngày làm việc/tuần: %d ngày\n" +
                        "• Số khung giờ/ngày: %d khung\n" +
                        "• Tổng số slot: %d slot",
                (int)pricePerHour, selectedDayOfWeek.size(), selectedSlotIds.size(), totalSlots);

        tvCalculationDetails.setText(calculationDetails);
    }

    private void resetPriceDisplay() {
        tvBaseSalary.setText("0 VNĐ");
        tvPlatformFeeLabel.setText("Phí nền tảng (0%)");
        tvPlatformFee.setText("0 VNĐ");
        tvTotalSalary.setText("0 VNĐ");
        tvCalculationDetails.setText("");
    }

    private boolean validateForm() {
        EditText edtJobTitle = findViewById(R.id.edtJobTitle);
        EditText edtLocation = findViewById(R.id.edtLocation);
        EditText edtStartDate = findViewById(R.id.edtStartDate);
        EditText edtEndDate = findViewById(R.id.edtEndDate);
        EditText edtDescription = findViewById(R.id.edtDescription);
        if (edtJobTitle.getText().toString().isEmpty()) {
            edtJobTitle.setError("Vui lòng nhập tiêu đề công việc");
            return false;
        }

        if (edtLocation.getText().toString().isEmpty()) {
            edtLocation.setError("Vui lòng nhập địa điểm");
            return false;
        }
        if (edtDescription.getText().toString().isEmpty()) {
            edtLocation.setError("Vui lòng nhập mô tả");
            return false;
        }

        if (edtStartDate.getText().toString().isEmpty()) {
            edtStartDate.setError("Vui lòng chọn ngày bắt đầu");
            return false;
        }

        if (edtEndDate.getText().toString().isEmpty()) {
            edtEndDate.setError("Vui lòng chọn ngày kết thúc");
            return false;
        }

        if (adapter == null || adapter.getSelectedServiceIds().isEmpty()) {
            Toast.makeText(this, "Vui lòng chọn ít nhất một dịch vụ", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (selectedDayOfWeek.isEmpty()) {
            Toast.makeText(this, "Vui lòng chọn ít nhất một ngày làm việc", Toast.LENGTH_SHORT).show();
            return false;
        }

        if (selectedSlotIds.isEmpty()) {
            Toast.makeText(this, "Vui lòng chọn ít nhất một khung giờ làm việc", Toast.LENGTH_SHORT).show();
            return false;
        }


        return true;
    }

    private void onSubmit() {
        if (!validateForm()) {
            return;
        }
        layoutWarningContainer.setVisibility(View.GONE);
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);
        if (accountId == -1) {
            Toast.makeText(this, "Vui lòng đăng nhập lại", Toast.LENGTH_SHORT).show();
            return;
        }
        String totalPriceStr = tvTotalSalary.getText().toString().replaceAll("[^0-9]", "");
        double requiredAmount = totalPriceStr.isEmpty() ? 0 : Double.parseDouble(totalPriceStr);

        if (requiredAmount <= 0) {
            Toast.makeText(this, "Vui lòng kiểm tra lại thông tin giá", Toast.LENGTH_SHORT).show();
            return;
        }

        showLoading();
        checkWalletBalance(accountId, requiredAmount);
    }

    private void checkWalletBalance(int accountId, double requiredAmount) {
        APIServices apiService = APIClient.getClient(this).create(APIServices.class);
        Call<Wallet> call = apiService.getWalletByAccountID(accountId);

        call.enqueue(new Callback<Wallet>() {
            @Override
            public void onResponse(Call<Wallet> call, Response<Wallet> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Wallet wallet = response.body();
                    double currentBalance = wallet.getBalance();

                    if (currentBalance < requiredAmount) {
                        dismissLoading();
                        showBalanceWarning(currentBalance, requiredAmount);
                    } else {
                        // Số dư đủ, tiếp tục lấy thông tin family
                        getFamilyDetails(accountId);
                    }
                } else {
                    dismissLoading();
                    Toast.makeText(AddJobActivity.this,
                            "Không thể kiểm tra số dư ví",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Wallet> call, Throwable t) {
                dismissLoading();
                Toast.makeText(AddJobActivity.this,
                        "Lỗi kết nối: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void showBalanceWarning(double currentBalance, double requiredAmount) {
        runOnUiThread(() -> {
            double needed = requiredAmount - currentBalance;

            String warning = String.format(Locale.getDefault(),
                    "Số dư ví không đủ!\n• Số dư hiện tại: %,d VNĐ\n• Số tiền cần: %,d VNĐ\n• Cần nạp thêm: %,d VNĐ",
                    (int)currentBalance, (int)requiredAmount, (int)needed);

            tvBalanceWarning.setText(warning);
            layoutWarningContainer.setVisibility(View.VISIBLE);


            Button btnTopUp = new Button(this);
            btnTopUp.setText("Nạp tiền ngay");
            btnTopUp.setBackgroundColor(ContextCompat.getColor(this, R.color.colorPrimary));
            btnTopUp.setTextColor(Color.WHITE);
            btnTopUp.setOnClickListener(v -> {
                Intent intent = new Intent(AddJobActivity.this, DepositActivity.class);
                startActivity(intent);
            });

            layoutWarningContainer.removeAllViews();
            layoutWarningContainer.addView(tvBalanceWarning);
            layoutWarningContainer.addView(btnTopUp);
            if (scrollView != null) {
                scrollView.post(() -> scrollView.smoothScrollTo(0, layoutWarningContainer.getTop()));
            } else {
                Log.e("ScrollView", "ScrollView is null");
            }
        });
    }

    private void getFamilyDetails(int accountId) {
        APIServices apiService = APIClient.getClient(this).create(APIServices.class);
        Call<FamilyAccountDetailDTO> call = apiService.getFamilyByAccountID(accountId);

        call.enqueue(new Callback<FamilyAccountDetailDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountDetailDTO> call, Response<FamilyAccountDetailDTO> response) {
                if (response.isSuccessful() && response.body() != null) {
                    FamilyAccountDetailDTO familyDetail = response.body();
                    int familyId = familyDetail.getFamilyID();

                    if (familyId > 0) {
                        createJob(familyId);
                    } else {
                        dismissLoading();
                        Toast.makeText(AddJobActivity.this,
                                "Tài khoản chưa có thông tin gia đình",
                                Toast.LENGTH_SHORT).show();
                    }
                } else {
                    dismissLoading();
                    handleApiError(response);
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountDetailDTO> call, Throwable t) {
                dismissLoading();
                Log.e("API_ERROR", "Network call failed", t);
                Toast.makeText(AddJobActivity.this,
                        t instanceof IOException ? "Lỗi kết nối mạng" : "Lỗi không mong muốn",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void createJob(int familyId) {
        // Lấy thông tin từ form
        String jobName = ((EditText) findViewById(R.id.edtJobTitle)).getText().toString();
        String location = ((EditText) findViewById(R.id.edtLocation)).getText().toString();
        String description = ((EditText) findViewById(R.id.edtDescription)).getText().toString();
        String startDate = ((EditText) findViewById(R.id.edtStartDate)).getText().toString();
        String endDate = ((EditText) findViewById(R.id.edtEndDate)).getText().toString();
        String detailLocation = ((EditText) findViewById(R.id.edtDetaillLocation)).getText().toString();
            // Lấy giá từ UI
        String totalPriceStr = tvTotalSalary.getText().toString().replaceAll("[^0-9]", "");
        double price = totalPriceStr.isEmpty() ? 0 : Double.parseDouble(totalPriceStr);

            // Xác định loại công việc (1 = Full-time, 2 = Part-time)
        int jobType = (selectedJobType == JobType.FULL_TIME) ? 1 : 2;

            // Gọi API
        APIServices apiService = APIClient.getClient(this).create(APIServices.class);
        Call<ResponseBody> call = apiService.addJob(
                    familyId,
                    jobName,
                    jobType,
                    location,
                    detailLocation,
                    price,
                    convertToApiDateFormat(startDate),
                    convertToApiDateFormat(endDate),
                    description,
                    false,
                    adapter.getSelectedServiceIds(),
                    selectedSlotIds,
                    selectedDayOfWeek
            );

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    dismissLoading();
                    if (response.isSuccessful()) {
                        Toast.makeText(AddJobActivity.this, "Tạo công việc thành công", Toast.LENGTH_SHORT).show();
                        finish();
                    } else {
                        try {
                            String errorBody = response.errorBody().string();
                            Toast.makeText(AddJobActivity.this,
                                    "Lỗi khi tạo công việc: " + errorBody,
                                    Toast.LENGTH_LONG).show();
                        } catch (IOException e) {
                            Toast.makeText(AddJobActivity.this,
                                    "Lỗi khi xử lý phản hồi",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    dismissLoading();
                    Toast.makeText(AddJobActivity.this,
                            "Lỗi kết nối: " + t.getMessage(),
                            Toast.LENGTH_SHORT).show();
                }
            });

    }
    private void handleApiError(Response<?> response) {
        try {
            String errorBody = response.errorBody() != null ? response.errorBody().string() : "null";
            Log.e("API_ERROR", "Error response: " + errorBody);

            if (response.code() == 401) {
                Toast.makeText(this, "Phiên đăng nhập hết hạn", Toast.LENGTH_SHORT).show();
            } else if (response.code() == 404) {
                Toast.makeText(this, "Không tìm thấy thông tin", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Lỗi hệ thống: " + response.code(), Toast.LENGTH_SHORT).show();
            }
        } catch (IOException e) {
            Toast.makeText(this, "Lỗi không xác định", Toast.LENGTH_SHORT).show();
        }
    }
    private String convertToApiDateFormat(String originalDate) {
        try {
            SimpleDateFormat originalFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            SimpleDateFormat apiFormat = new SimpleDateFormat("yyyy/MM/dd");
            Date date = originalFormat.parse(originalDate);
            return apiFormat.format(date);
        } catch (ParseException e) {
            Log.e("DATE_ERROR", "Date parsing failed", e);
            return originalDate;
        }
    }


}