package com.example.housekeeperapplication.API;

import android.content.Context;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class APIClient {
    private static final String BASE_URL = "https://housekeeper-connect-87a84574bb44.herokuapp.com/"; // Địa chỉ API của bạn
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
