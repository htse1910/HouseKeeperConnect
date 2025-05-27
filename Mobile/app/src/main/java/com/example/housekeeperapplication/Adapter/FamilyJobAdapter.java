package com.example.housekeeperapplication.Adapter;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.housekeeperapplication.API.APIClient;
import com.example.housekeeperapplication.API.Interfaces.APIServices;
import com.example.housekeeperapplication.JobDetailActivity;
import com.example.housekeeperapplication.Model.DTOs.FamilyJobSummaryDTO;
import com.example.housekeeperapplication.Model.DTOs.SupportRequestCreateDTO;
import com.example.housekeeperapplication.R;

import java.io.IOException;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FamilyJobAdapter extends RecyclerView.Adapter<FamilyJobAdapter.JobViewHolder> {

    private final Context context;
    private final List<FamilyJobSummaryDTO> jobList;

    public FamilyJobAdapter(Context context, List<FamilyJobSummaryDTO> jobList) {
        this.context = context;
        this.jobList = jobList;
    }

    @NonNull
    @Override
    public JobViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_family_job, parent, false);
        return new JobViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull JobViewHolder holder, int position) {
        FamilyJobSummaryDTO job = jobList.get(position);
        holder.tvJobName.setText("🧽 " + job.getJobName());
        holder.tvJobLocation.setText("📍 Địa điểm: " + job.getLocation());
        holder.tvJobSalary.setText("💵 Lương: " + job.getPrice() + " VND");
        holder.tvJobType.setText("⚙️ Loại: " + (job.getJobType() == 1 ? "Ngắn hạn" : "Định kỳ"));
        holder.tvJobStatus.setText("📌 Trạng thái: " + getJobStatusString(job.getStatus()));
        int status = job.getStatus();
        if (status != 4 && status != 6 && status != 8 && status != 9) {
            holder.btnDelete.setVisibility(View.VISIBLE);
            holder.btnDelete.setOnClickListener(v -> showDeleteConfirmationDialog(job));
        } else {
            holder.btnDelete.setVisibility(View.GONE);
        }

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, JobDetailActivity.class);
            intent.putExtra("jobID", job.getJobID());
            context.startActivity(intent);
        });
    }
    private void showDeleteConfirmationDialog(FamilyJobSummaryDTO job) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Gửi yêu cầu xoá công việc");
        builder.setMessage("Bạn có chắc muốn gửi yêu cầu xóa công việc này không?\n\n" +
                "Loại yêu cầu: Công việc (2)\n\n" +
                "Nội dung:\nHãy xóa công việc " + job.getJobName() + ", ID: " + job.getJobID());

        builder.setPositiveButton("Gửi yêu cầu", (dialog, which) -> {
            sendDeleteRequest(job);
        });

        builder.setNegativeButton("Hủy", (dialog, which) -> dialog.dismiss());

        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void sendDeleteRequest(FamilyJobSummaryDTO job) {
        SharedPreferences prefs = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE);
        int accountId = prefs.getInt("accountID", -1);

        if (accountId == -1) {
            Toast.makeText(context, "Vui lòng đăng nhập lại", Toast.LENGTH_SHORT).show();
            return;
        }

        String content = "Hãy xóa công việc " + job.getJobName() + ", ID: " + job.getJobID();

        APIServices api = APIClient.getClient(context).create(APIServices.class);
        Call<ResponseBody> call = api.addSupportRequest(accountId, 2, content);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try {
                        String responseBody = response.body().string();
                        Toast.makeText(context, "Yêu cầu hủy thành công: " + responseBody, Toast.LENGTH_SHORT).show();
                    } catch (IOException e) {
                        e.printStackTrace();
                        Toast.makeText(context, "Yêu cầu hủy thành công", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    try {
                        String errorBody = response.errorBody().string();
                        Toast.makeText(context, "Gửi yêu cầu thất bại: " + errorBody, Toast.LENGTH_LONG).show();
                        Log.e("API_ERROR", errorBody);
                    } catch (IOException e) {
                        e.printStackTrace();
                        Toast.makeText(context, "Gửi yêu cầu thất bại", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(context, "Lỗi kết nối: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("API_ERROR", t.getMessage());
            }
        });
    }

    @Override
    public int getItemCount() {
        return jobList != null ? jobList.size() : 0;
    }

    static class JobViewHolder extends RecyclerView.ViewHolder {
        TextView tvJobName, tvJobLocation, tvJobSalary, tvJobType, tvJobStatus;
        Button btnDelete;

        public JobViewHolder(@NonNull View itemView) {
            super(itemView);
            tvJobName = itemView.findViewById(R.id.tvJobName);
            tvJobLocation = itemView.findViewById(R.id.tvJobLocation);
            tvJobSalary = itemView.findViewById(R.id.tvJobSalary);
            tvJobType = itemView.findViewById(R.id.tvJobType);
            tvJobStatus = itemView.findViewById(R.id.tvJobStatus);
            btnDelete = itemView.findViewById(R.id.btnDelete);
        }
    }

    private String getJobStatusString(int status) {
        switch (status) {
            case 1: return "🕒 Công việc đang chờ duyệt";
            case 2: return "✔️ Công việc đã xác minh";
            case 3: return "📌 Công việc đã chấp nhận";
            case 4: return "✅ Công việc đã hoàn thành";
            case 5: return "⏰ Công việc đã hết hạn";
            case 6: return "❌ Công việc đã hủy";
            case 7: return "🚫 Không được phép";
            case 8: return "👨‍👩‍👧 Công việc đang chờ xác nhận của gia đình";
            case 9: return "👨‍👩‍👧 Người giúp việc đã nghỉ";
            case 10: return "👨‍👩‍👧 Công việc đã giao lại";
            default: return "❓ Unknown";
        }
    }
}
