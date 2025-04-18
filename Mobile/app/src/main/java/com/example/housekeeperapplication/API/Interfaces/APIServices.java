package com.example.housekeeperapplication.API.Interfaces;

import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.LoginInfo;
import com.example.housekeeperapplication.Model.DTOs.TransactionInfo;
import com.example.housekeeperapplication.Model.DTOs.WalletInfo;


import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Query;

public interface APIServices {
    //Account API
    @POST("api/Account/Login")
    Call<Account> login(
            @Body LoginInfo loginInfo
    );
    @Multipart
    @POST("api/Account/Register")
    Call<ResponseBody> register(
            @Part("name") RequestBody name,
            @Part("email") RequestBody email,
            @Part("password") RequestBody password,
            @Part("bankAccountNumber") RequestBody bankNum,
            @Part("phone") RequestBody phone,
            @Part("roleID") RequestBody roleID,
            @Part("introduction") RequestBody description,
            @Part("address") RequestBody address,
            @Part("gender") RequestBody gender,
            @Part("nickname") RequestBody nickname,
            @Part MultipartBody.Part localProfilePicture // Change to MultipartBody.Part
    );

    //Wallet APIs

    @GET("api/Wallet/GetWalletByAccountID")
    Call<WalletInfo> getWalletByAccount(
            @Query("id") int accountID
    );

    //Transaction APIs
    @GET("api/Transaction/GetTransactionByUserID")
    Call<TransactionInfo> getTransByAccountID(
            @Query("id") String accountID,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );
}
