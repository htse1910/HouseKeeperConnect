package com.example.housekeeperapplication;

import android.app.DatePickerDialog;
import android.app.ProgressDialog;
import android.content.SharedPreferences;
import android.os.Bundle;
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
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.Adapter.ServiceExpandableAdapter;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.JobCreateDTO;
import com.example.housekeeperapplication.Model.JobType;
import com.example.housekeeperapplication.Model.Service;
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
    private JobType selectedJobType = JobType.FULL_TIME; // Mặc định là Toàn thời gian
    private Date date;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_job);

        // Khởi tạo views
        expandableListView = findViewById(R.id.expandableListViewJobTypes);


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
    // Thiết lập Spinner cho JobType
    private void setupJobTypeSpinner() {
        Spinner spinner = findViewById(R.id.spinnerJobType);
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                // position 0: Toàn thời gian, position 1: Bán thời gian
                selectedJobType = position == 0 ? JobType.FULL_TIME : JobType.PART_TIME;

                // Có thể thêm xử lý khác nếu cần
                String selectedType = parent.getItemAtPosition(position).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Xử lý khi không có gì được chọn
            }
        });
    }
    // Thiết lập DatePicker
    private void setupDatePickers() {
        EditText edtStartDate = findViewById(R.id.edtStartDate);
        EditText edtEndDate = findViewById(R.id.edtEndDate);

        edtStartDate.setOnClickListener(v -> showDatePicker(edtStartDate));
        edtEndDate.setOnClickListener(v -> showDatePicker(edtEndDate));
    }

    private void showDatePicker(EditText editText) {
        Calendar calendar = Calendar.getInstance();
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                this,
                (view, year, month, dayOfMonth) -> {
                    String selectedDate = String.format("%02d/%02d/%04d", dayOfMonth, month + 1, year);
                    editText.setText(selectedDate);
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
        );
        datePickerDialog.show();
    }
    // Thiết lập các ngày làm việc
    private void setupWorkingDaysCheckboxes() {
        LinearLayout daysLayout = findViewById(R.id.layoutWorkingDays);
        for (int i = 0; i < daysLayout.getChildCount(); i++) {
            CheckBox cb = (CheckBox) daysLayout.getChildAt(i);
            final int dayOfWeek = i; // CN=0, T2=1, T3=2,..., T7=6

            cb.setOnCheckedChangeListener((buttonView, isChecked) -> {
                Log.d("CHECKBOX_DEBUG", "Day " + dayOfWeek + ": " + isChecked);
                if (isChecked) {
                    selectedDayOfWeek.add(dayOfWeek);
                } else {
                    selectedDayOfWeek.remove(Integer.valueOf(dayOfWeek));
                }
            });
        }
    }
    // Thiết lập các khung giờ làm việc
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
    // Tải danh sách dịch vụ
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

        // Mở rộng tất cả các nhóm ban đầu
        for (int i = 0; i < adapter.getGroupCount(); i++) {
            expandableListView.expandGroup(i);
        }
    }


    private boolean validateForm() {
        EditText edtJobTitle = findViewById(R.id.edtJobTitle);
        EditText edtLocation = findViewById(R.id.edtLocation);
        EditText edtStartDate = findViewById(R.id.edtStartDate);
        EditText edtEndDate = findViewById(R.id.edtEndDate);

        if (edtJobTitle.getText().toString().isEmpty()) {
            edtJobTitle.setError("Vui lòng nhập tiêu đề công việc");
            return false;
        }

        if (edtLocation.getText().toString().isEmpty()) {
            edtLocation.setError("Vui lòng nhập địa điểm");
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

        // Lấy thông tin từ SharedPreferences
        SharedPreferences prefs = getSharedPreferences("user_prefs", MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);
        Log.d("API_REQUEST", "AccountID: " + accountId);
        if (accountId == -1) {
            Toast.makeText(this, "Vui lòng đăng nhập lại", Toast.LENGTH_SHORT).show();
            return;
        }

        // Gọi API để lấy familyID từ accountID
        showLoading();
        APIServices apiService = APIClient.getClient(this).create(APIServices.class);
        Call<FamilyAccountDetailDTO> call = apiService.getFamilyByAccountID(accountId);
        Log.d("API_REQUEST", "URL: " + call.request().url()); // Log URL
        Log.d("API_REQUEST", "Headers: " + call.request().headers()); // Log headers
        call.enqueue(new Callback<FamilyAccountDetailDTO>() {
            @Override
            public void onResponse(Call<FamilyAccountDetailDTO> call, Response<FamilyAccountDetailDTO> response) {
                // Log thông tin response
                Log.d("API_RESPONSE", "URL: " + call.request().url());
                Log.d("API_RESPONSE", "Status Code: " + response.code());

                if (response.isSuccessful() && response.body() != null) {
                    FamilyAccountDetailDTO familyDetail = response.body();
                    int familyId = familyDetail.getFamilyID();
                    Log.d("API_RESPONSE", "FamilyID received: " + familyId);

                    if (familyId > 0) {
                        createJob(familyId);
                    } else {
                        dismissLoading();
                        Log.e("API_ERROR", "FamilyID is invalid: " + familyId);
                        Toast.makeText(AddJobActivity.this,
                                "Tài khoản chưa có thông tin gia đình",
                                Toast.LENGTH_SHORT).show();
                    }
                } else {
                    dismissLoading();
                    try {
                        String errorBody = response.errorBody() != null ?
                                response.errorBody().string() : "null";
                        Log.e("API_ERROR", "Error response: " + errorBody);

                        // Xử lý các mã lỗi cụ thể
                        if (response.code() == 401) {
                            Toast.makeText(AddJobActivity.this,
                                    "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại",
                                    Toast.LENGTH_SHORT).show();
                            // Chuyển đến màn hình login
                        } else if (response.code() == 404) {
                            Toast.makeText(AddJobActivity.this,
                                    "Không tìm thấy thông tin tài khoản",
                                    Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(AddJobActivity.this,
                                    "Lỗi hệ thống: " + response.code(),
                                    Toast.LENGTH_SHORT).show();
                        }
                    } catch (IOException e) {
                        Log.e("API_ERROR", "Error parsing error body", e);
                        Toast.makeText(AddJobActivity.this,
                                "Lỗi không xác định",
                                Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<FamilyAccountDetailDTO> call, Throwable t) {
                dismissLoading();
                Log.e("API_ERROR", "Network call failed", t);

                // Kiểm tra loại lỗi
                if (t instanceof IOException) {
                    Toast.makeText(AddJobActivity.this,
                            "Lỗi kết nối mạng, vui lòng kiểm tra internet",
                            Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(AddJobActivity.this,
                            "Lỗi không mong muốn: " + t.getMessage(),
                            Toast.LENGTH_SHORT).show();
                }

                // Log thêm thông tin request
                Log.e("API_ERROR", "Request URL: " + call.request().url());
            }
        });
    }


    private void createJob(int familyId) {
        // Lấy các thông tin từ form
        String jobName = ((EditText) findViewById(R.id.edtJobTitle)).getText().toString();
        String location = ((EditText) findViewById(R.id.edtLocation)).getText().toString();
        String description = ((EditText) findViewById(R.id.edtDescription)).getText().toString();
        String startDate = convertToApiDateFormat(((EditText) findViewById(R.id.edtStartDate)).getText().toString());
        String endDate = convertToApiDateFormat(((EditText) findViewById(R.id.edtEndDate)).getText().toString());
        double price = 0.0; // Hoặc lấy từ input nếu có

        // Chuyển đổi danh sách IDs thành chuỗi
        String serviceIds = convertListToString(adapter.getSelectedServiceIds());
        String slotIds = convertListToString(selectedSlotIds);
        String dayOfWeek = convertListToString(selectedDayOfWeek);

        // Gọi API
        APIServices apiService = APIClient.getClient(AddJobActivity.this).create(APIServices.class);
        Call<ResponseBody> call = apiService.addJob(
                familyId,
                jobName,
                selectedJobType.ordinal(), // Chuyển enum thành số (0 hoặc 1)
                location,
                price,
                startDate,
                endDate,
                description,
                false, // IsOffered
                serviceIds,
                slotIds,
                dayOfWeek
        );

        // Xử lý response
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
                        Toast.makeText(AddJobActivity.this, "Lỗi: " + errorBody, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        Toast.makeText(AddJobActivity.this, "Lỗi khi tạo công việc", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                dismissLoading();
                Toast.makeText(AddJobActivity.this, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    // Hàm chuyển đổi định dạng ngày
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

    // Hàm chuyển List<Integer> thành chuỗi phân cách bằng dấu phẩy
    private String convertListToString(List<Integer> list) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < list.size(); i++) {
            sb.append(list.get(i));
            if (i < list.size() - 1) {
                sb.append(",");
            }
        }
        return sb.toString();
    }

}