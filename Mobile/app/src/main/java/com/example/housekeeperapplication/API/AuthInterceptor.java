package com.example.housekeeperapplication.API;

import android.content.Context;
import android.content.SharedPreferences;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
// Interceptor giúp gửi token JWT tự động cho mọi API request, không cần truyền thủ công @Header("Authorization") nữa.
public class AuthInterceptor implements Interceptor {
    private final Context context;

    public AuthInterceptor(Context context) {
        this.context = context;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        // Lấy token từ SharedPreferences
        SharedPreferences prefs = context.getSharedPreferences("user_prefs", Context.MODE_PRIVATE);
        String token = prefs.getString("token", null); // Đảm bảo lấy token với key "token"

        Request original = chain.request();
        Request.Builder builder = original.newBuilder();

        // Nếu có token thì thêm vào header Authorization
        if (token != null && !token.isEmpty()) {
            builder.header("Authorization", "Bearer " + token);
        }

        Request newRequest = builder.build();
        return chain.proceed(newRequest);
    }

}
