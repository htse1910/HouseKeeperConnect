package com.example.housekeeperapplication.API;

import android.content.Context;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class APIClient {
   private static final String BASE_URL = "https://0qqx43v4-5280.asse.devtunnels.ms/"; // Địa chỉ API của bạn
    //private static final String BASE_URL = "http://10.0.2.2:5280/"; // Địa chỉ API của bạn*/

    private static Retrofit retrofit = null;

    // Chuyển getClient() nhận thêm Context
    public static Retrofit getClient(Context context) {
        if (retrofit == null) {
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .addInterceptor(new AuthInterceptor(context))  // Thêm interceptor để gắn token
                    .build();
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(okHttpClient)  // Dùng OkHttpClient đã cấu hình interceptor
                    .build();
        }
        return retrofit;
    }
}
