package com.example.housekeeperapplication;

import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class PaymentResultActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_family_deposit_return);

        Uri data = getIntent().getData();
        if (data != null) {
            // Extract orderCode from the deep link
            String orderCode = data.getQueryParameter("orderCode");
            String status = data.getQueryParameter("status");

            // Example: Use the orderCode as needed
            if (orderCode != null) {
                // TODO: Display orderCode, verify payment, etc.
                Toast.makeText(this, "Order: " + orderCode + ", Status: " + status, Toast.LENGTH_LONG).show();
            }
        }

        // Optionally, finish or update the UI
    }
}
