package com.example.housekeeperapplication.API.Interfaces;

import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.BookingDTO;
import com.example.housekeeperapplication.Model.DTOs.BookingHousekeeperDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyJobSummaryDTO;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayForFamilyDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailPageDTO;
import com.example.housekeeperapplication.Model.DTOs.LoginInfo;
import com.example.housekeeperapplication.Model.DTOs.TransactionInfo;
import com.example.housekeeperapplication.Model.DTOs.WalletInfo;
import com.example.housekeeperapplication.Model.Job;
import com.example.housekeeperapplication.Model.Transaction;
import com.example.housekeeperapplication.Model.Wallet;


import java.util.List;

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

    @GET("api/Wallet/getWallet")
    Call<Wallet> getWalletById(
            @Query("id") int id);

    @GET("api/Transaction/GetTransactionByUserID")
    Call<List<Transaction>> getTransactionByUserID(
            @Query("id") int accountId,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );;

    @POST("api/Withdraw/RequestWithdrawOTP")
    Call<ResponseBody> requestWithdrawOTP(
            @Query("accountId") int accountId,
            @Query("amount") int amount
    );

    @POST("api/Withdraw/VerifyOTP")
    Call<ResponseBody> verifyOTP(
            @Query("withdrawID") int withdrawID,
            @Query("otp") String otp
    );
    @GET("api/HouseKeeper/GetHousekeeperByAccountID")
    Call<Housekeeper> getHousekeeperByAccountID(@Query("id") int accountId);

    @Multipart
    @POST("api/IDVerifications/CreateIDVerification")
    Call<ResponseBody> uploadIDVerification(
            @Query("housekeeperId") int housekeeperId,
            @Part MultipartBody.Part FrontPhoto,
            @Part MultipartBody.Part BackPhoto,
            @Part MultipartBody.Part FacePhoto
    );

    @GET("api/HouseKeeper/HousekeeperDisplay")
    Call<List<HousekeeperDisplayForFamilyDTO>> getHousekeepersForFamily(
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );

    @GET("api/Account/GetAccount")
    Call<Account> getAccountById(@Query("id") int accountId);
    @GET("api/Booking/GetBookingByHousekeeperID")
    Call<List<BookingHousekeeperDTO>> getBookingsByHousekeeperID(@Query("housekeeperId") int housekeeperId);
    @GET("api/Job/GetJobByID")
    Call<Job> getJobById(@Query("id") int jobId);

    @POST("api/Job/CheckIn")
    Call<Void> checkIn(@Query("bookingId") int bookingId);

    @GET("api/Job/GetJobsByAccountID")
    Call<List<FamilyJobSummaryDTO>> getJobsByAccountID(
            @Query("accountId") int accountId,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );
    @GET("api/Job/GetJobDetailByID")
    Call<JobDetailForBookingDTO> getJobDetailByID(@Query("id") int jobID);

    @GET("api/Families/GetFamilyByID")
    Call<FamilyAccountMappingDTO> getFamilyByID(@Query("id") int familyID);

    @GET("api/Families/GetFamilyByAccountID")
    Call<FamilyAccountDetailDTO> getFamilyByAccountID(@Query("id") int accountID);
    @GET("api/HouseKeeper/GetHousekeeperByID")
    Call<HousekeeperDetailDTO> getHousekeeperByID(@Query("id") int housekeeperID);

    @GET("api/Job/GetJobDetailByID")
    Call<JobDetailPageDTO> getFullJobDetailByID(@Query("id") int jobID);

    @POST("api/Job/ConfirmSlotWorked")
    Call<Void> confirmSlotWorked(@Query("bookingId") int bookingId);

    @POST("api/Job/HousekeeperCompleteJob")
    Call<Void> completeJobByHousekeeper(
            @Query("jobID") int jobID,
            @Query("accountID") int accountID
    );

    @POST("api/Job/ConfirmJobCompletion")
    Call<Void> confirmJobCompletion(
            @Query("jobId") int jobId,
            @Query("accountID") int accountId
    );

}
