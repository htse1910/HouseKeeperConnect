package com.example.housekeeperapplication.API.Interfaces;

import com.example.housekeeperapplication.Model.Account;
import com.example.housekeeperapplication.Model.DTOs.ApplicationDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.BookingHousekeeperDTO;
import com.example.housekeeperapplication.Model.DTOs.BookingResponseDTO;
import com.example.housekeeperapplication.Model.DTOs.Chat;
import com.example.housekeeperapplication.Model.DTOs.ChatReturnDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyAccountMappingDTO;
import com.example.housekeeperapplication.Model.DTOs.FamilyJobSummaryDTO;
import com.example.housekeeperapplication.Model.DTOs.FeeDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.HouseKeeperSkillDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.Housekeeper;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDetailDTO;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperDisplayForFamilyDTO;
import com.example.housekeeperapplication.Model.DTOs.HousekeeperSkillMappingDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.JobCreateDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailForBookingDTO;
import com.example.housekeeperapplication.Model.DTOs.JobDetailPageDTO;
import com.example.housekeeperapplication.Model.DTOs.LoginInfo;
import com.example.housekeeperapplication.Model.DTOs.PaymentLinkDTO;
import com.example.housekeeperapplication.Model.DTOs.RatingCreateDTO;
import com.example.housekeeperapplication.Model.DTOs.RatingDisplayDTO;
import com.example.housekeeperapplication.Model.DTOs.SupportRequestCreateDTO;
import com.example.housekeeperapplication.Model.Family;
import com.example.housekeeperapplication.Model.Job;
import com.example.housekeeperapplication.Model.Notification;
import com.example.housekeeperapplication.Model.Service;
import com.example.housekeeperapplication.Model.Transaction;
import com.example.housekeeperapplication.Model.Wallet;


import java.util.List;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.PUT;
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
            @Part("phone") RequestBody phone,
            @Part("roleID") RequestBody roleID,
            @Part("introduction") RequestBody description,
            @Part("address") RequestBody address,
            @Part("gender") RequestBody gender,
            @Part("nickname") RequestBody nickname,
            @Part MultipartBody.Part localProfilePicture // Change to MultipartBody.Part
    );

    //Wallet APIs
    @GET("api/Wallet/getWallet")
    Call<Wallet> getWalletById(
            @Query("id") int id);

    @PUT("api/Wallet/Deposit")
    Call<PaymentLinkDTO> deposit(
            @Query("id") int accountID,
            @Query("balance") double amount,
            @Query("isMobile") boolean isMobile
    );

    @GET("api/Wallet/GetWalletByAccountID")
    Call<Wallet> getWalletByAccountID(@Query("id") int accountId);

    //Transaction APIs
    @GET("api/Transaction/GetTransactionByUserID")
    Call<List<Transaction>> getTransactionByUserID(
            @Query("id") int accountId,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );

    //Notification APIs
    @GET("api/Notification/GetNotificationByUserID")
    Call<List<Notification>> getNotisByUserID(
            @Query("id") int accountID,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );
    @GET("api/GetTotalUnReadNotiByUser")
    Call<Integer> getTotalNotiByUser(
        @Query("id") int accountID
    );
    //Withdraw APIs
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
    //Housekeeper APIs
    @GET("api/HouseKeeper/GetHousekeeperByAccountID")
    Call<Housekeeper>
    getHousekeeperByAccountID(@Query("id") int accountId);

    //IDVerification


    @Multipart
    @POST("api/IDVerifications/CreateIDVerification")
    Call<ResponseBody> uploadIDVerification(
            @Query("housekeeperId") int housekeeperId,
            @Part MultipartBody.Part FrontPhoto,
            @Part MultipartBody.Part BackPhoto,
            @Part MultipartBody.Part FacePhoto
    );
    @Multipart
    @PUT("api/IDVerifications/UpdateIDVerification")
    Call<ResponseBody> updateIDVerification(
            @Part("verifyID") RequestBody verifyID,
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
    Call<List<BookingResponseDTO>> getBookingsByHousekeeperID(
            @Query("housekeeperId") int housekeeperId,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize);
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

    @Multipart
    @PUT("api/HouseKeeper/UpdateHousekeeper")
    Call<ResponseBody> updateHousekeeper(
            @Part("AccountID") RequestBody accountID,
            @Part("Name") RequestBody name,
            @Part("Phone") RequestBody phone,
            @Part("WorkType") RequestBody workType,
            @Part("BankAccountNumber") RequestBody bankAccountNumber,
            @Part("BankAccountName") RequestBody bankAccountName,
            @Part("Introduction") RequestBody introduction,
            @Part("Address") RequestBody address,
            @Part("Gender") RequestBody gender,
            @Part("Nickname") RequestBody nickname,
            @Part MultipartBody.Part localProfilePicture
    );


    @Multipart
    @PUT("api/Families/UpdateFamily")
    Call<ResponseBody> updateFamily(
            @Part("AccountID") RequestBody accountID,
            @Part("Name") RequestBody name,
            @Part("Phone") RequestBody phone,
            @Part("BankAccountNumber") RequestBody bankAccountNumber,
            @Part("BankAccountName") RequestBody bankAccountName,
            @Part("Introduction") RequestBody introduction,
            @Part("Address") RequestBody address,
            @Part("Gender") RequestBody gender,
            @Part("Nickname") RequestBody nickname,
            @Part MultipartBody.Part localProfilePicture
    );
    @GET("api/Job/JobList")
    Call<List<Job>> getVerifyJob(
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );


    @GET("api/Service/GetServiceByID")
    Call<Service> getServiceByID(@Query("id") int serviceID);
    @GET("api/Service/ServiceList")
    Call<List<Service>> getServiceList();

    //Chat APIs

    @GET("api/Chat/GetChat")
    Call<List<Chat>> getChat(
        @Query("fromAccountId") int fromID,
        @Query("toAccountId") int toID
    );

    @GET("api/Chat/GetChatUsersByUser")
    Call<List<Integer>> getChatUsersByUser(
        @Query("fromAccountId") int fromID
    );
    @POST("api/Chat/Send")
    Call<ChatReturnDTO> sendChat(
            @Query("fromAccountId") int fromID,
            @Query("toAccountId") int toID,
            @Query("message") String mess
    );

    @PUT("api/Chat/IsRead")
    Call<Integer> ChatIsRead(
            @Query("id") int id
    );
    @POST("api/Job/AddJob")
    Call<ResponseBody> addJob(
            @Query("FamilyID") int familyId,
            @Query("JobName") String jobName,
            @Query("JobType") int jobType,
            @Query("Location") String location,
            @Query("DetailLocation") String detailLocation,
            @Query("Price") double price,
            @Query("StartDate") String startDate,
            @Query("EndDate") String endDate,
            @Query("Description") String description,
            @Query("IsOffered") boolean isOffered,
            @Query("ServiceIDs") List<Integer> serviceIds,
            @Query("SlotIDs") List<Integer> slotIds,
            @Query("DayofWeek") List<Integer> dayOfWeek
    );
    @GET("api/Application/GetApplicationsByAccountID")
    Call<List<ApplicationDisplayDTO>> getApplicationsByAccountId(
            @Query("uid") int userId,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );
    @PUT("api/Job/DenyJob")
    Call<Void> denyJob(@Query("jobId") int jobId, @Query("accountID") int accountID);

    @POST("api/Job/AcceptJob")
    Call<Void> acceptJob(@Query("jobId") int jobId, @Query("accountID") int accountID);
    @POST("api/Application/AddApplication")
    Call<ResponseBody> addApplication(@Query("accountID") int accountID, @Query("jobID") int jobID);

    @GET("api/HousekeeperSkillMapping/GetSkillsByAccountID")
    Call<List<HousekeeperSkillMappingDisplayDTO>> getSkillsByAccountId(
            @Query("accountId") int accountId
    );

    @POST("api/HousekeeperSkillMapping/AddSkill")
    Call<ResponseBody> addSkillToHousekeeper(
            @Query("accountId") int accountId,
            @Query("skillId") int skillId
    );

    @DELETE("api/HousekeeperSkillMapping/RemoveSkill")
    Call<ResponseBody> removeSkillFromHousekeeper(
            @Query("accountId") int accountId,
            @Query("skillId") int skillId
    );

    @GET("api/HouseKeeperSkills/HousekeeperSkillList")
    Call<List<HouseKeeperSkillDisplayDTO>> getAllHousekeeperSkills(
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );
    @GET("api/PlatformFee/GetPlatformFeeByID")
    Call<FeeDisplayDTO> getPlatformFeeByID(@Query("fID") int feeID);

    @GET("api/Application/ApplicationListByJob")
    Call<List<ApplicationDisplayDTO>> ApplicationListByJob(
            @Query("jobID") int jobID,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );
    @PUT("api/Application/UpdateApplication")
    Call<Void> UpdateApplication(@Query("AppID") int applicationID, @Query("status") int status);
    @POST("api/Job/ConfirmSlotWorked")
    Call<Void> ConfirmSlotWorked(@Query("bookingId") int bookingId);

    @POST("api/Job/ConfirmJobCompletion")
    Call<Void> ConfirmJobCompletion(@Query("jobId") int jobId, @Query("accountID") int accountID);

    @POST("api/Rating/AddRating")
    Call<ResponseBody> AddRating(
            @Query("Reviewer") int reviewer,
            @Query("Reviewee") int reviewee,
            @Query("Content") String content,
            @Query("Score") int score
    );
    @POST("api/SupportRequest/AddSupportRequest")
    Call<ResponseBody> addSupportRequest(
            @Query("requestedBy") int requestedBy,
            @Query("type") int type,
            @Query("content") String content
    );
    @POST("api/Job/ForceAbandonJobAndReassign")
    Call<Void> forceAbandonJobAndReassign(
            @Query("jobId") int jobId,
            @Query("accountID") int accountID
    );


    @GET("api/HouseKeeperSkills/GetHousekeeperSkillById")
    Call<HouseKeeperSkillDisplayDTO> getHousekeeperSkillById(@Query("id") int id);

    @GET("api/Rating/GetRatingListByHK")
    Call<List<RatingDisplayDTO>> getRatingsByHK(
            @Query("id") int id,
            @Query("pageNumber") int pageNumber,
            @Query("pageSize") int pageSize
    );
}
