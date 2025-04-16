package com.example.housekeeperapplication.API.Interfaces;

import com.example.housekeeperapplication.Model.Account;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface APIServices {
    @GET("api/Account/Login")
    Call<Account> login (
            @Query("email") String email,
            @Query("password") String password
    );
}
