package com.example.housekeeperapplication.API.Interfaces;

import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.LoginInfo;
import com.example.housekeeperapplication.Model.DTOs.RegInfo;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface APIServices {

    //Account API
    @POST("api/Account/Login")
    Call<Account> login (
            @Body LoginInfo loginInfo
            );
    @FormUrlEncoded
    @POST("api/Account/Register")
    Call<RegInfo> register (
         @Field("name") String name,
         @Field("email") String email,
         @Field("password") String password,
         @Field("bankNumber") String bankNum,
         @Field("roleID") int roleID,
         @Field("introduction") String description,
         @Field("address") String address,
         @Field("gender") int gender,
         @Field("Nickname") String nickname
    );
}
