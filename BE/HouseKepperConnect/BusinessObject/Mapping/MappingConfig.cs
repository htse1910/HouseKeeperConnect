﻿using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
using BusinessObject.Models;
using BusinessObject.Models.JWTToken;

namespace BusinessObject.Mapping
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            Map_List_Register();
            Map_List_Update_Account();
            Map_JWT_Login();
            Map_List_Display_Account();
            Map_Add_Family_Profile();
            Map_List_Display_Family();
            Map_Update_Family();
            Map_Update_HouseKeeper();
            Map_Create_HouseKeeper();
            Map_Display_HouseKeeper();
            Map_Create_Job();
            Map_Update_Job();
            Map_Create_Booking();
            Map_Update_Booking();
            Map_Chat();
            Map_List_Admin_Update_Account();
            Map_List_Pending_Housekeeper();
            Map_Update_Withdraw();
            Map_Create_Withdraw();
            Map_Display_Withdraw();
            Map_Create_Service();
            Map_Update_Service();
            Map_Verify_Request();
            Map_Create_IDVerification();
            Map_Update_IDVerification();
            Map_Display_IDVerification();
            Map_Display_Transaction();
            Map_Display_Notification();
            Map_Create_Notification();
            Map_Create_Job_Service();
            Map_Create_Job_Slots();
            Map_Display_Job();
            Map_Create_Booking_Slots();
            Map_Display_HouseKeeperSkill();
            Map_Create_HouseKeeperSkill();
            Map_Update_HouseKeeperSkill();
            Map_Display_HouseKeeperSkillMapping();
            Map_Create_HouseKeeperSkillMapping();
            Map_Display_Violation();
            Map_Create_Violation();
            Map_Update_Violation();
            Map_Display_Housekeeper_Violation();
            Map_Display_Rating();
            Map_Create_Housekeeper_Violation();
            Map_Reset_Password();
            Map_List_HouseKeeper();
            Map_OTP_Verification(); 
            Map_Display_SupportRequest(); 
            Map_Create_SupportRequest(); 
        }

        private void Map_List_Register()
        {
            CreateMap<AccountRegisterDTO, Account>()
                .ForMember(dest => dest.LocalProfilePicture, opt => opt.Ignore());
        }

        private void Map_List_Update_Account()
        {
            CreateMap<Account, AccountUpdateDTO>().ReverseMap();
        }

        private void Map_List_Admin_Update_Account()
        {
            CreateMap<Account, AdminUpdateAccountDTO>().ReverseMap();
        }

        private void Map_JWT_Login()
        {
            CreateMap<Account, TokenModel>()
                .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role != null ? src.Role.RoleName : "Unknown"))
                .ReverseMap();
        }

        private void Map_List_Display_Account()
        {
            CreateMap<Account, AccountDisplayDTO>().ReverseMap();
        }

        private void Map_Add_Family_Profile()
        {
            CreateMap<Family, AddFamilyProfileDTO>().ReverseMap();
        }

        private void Map_List_Display_Family()
        {
            CreateMap<FamilyDisplayDTO, Family>().ReverseMap();
            CreateMap<FamilyDisplayDTO, Account>().ReverseMap();
        }

        private void Map_Update_Family()
        {
            CreateMap<FamilyUpdateDTO, Family>();

            CreateMap<FamilyUpdateDTO, Account>()
                .ForMember(f => f.LocalProfilePicture, opt => opt.Ignore());
        }

        private void Map_Update_HouseKeeper()
        {
            CreateMap<HouseKeeperUpdateDTO, Housekeeper>();
            CreateMap<HouseKeeperUpdateDTO, Account>()
                .ForMember(f => f.LocalProfilePicture, opt => opt.Ignore());
        }

        private void Map_Display_HouseKeeper()
        {
            CreateMap<HouseKeeperDisplayDTO, Housekeeper>().ReverseMap();
            CreateMap<HouseKeeperDisplayDTO, Account>().ReverseMap();
            CreateMap<HouseKeeperDisplayDTO, IDVerification>().ReverseMap();
        }

        private void Map_List_HouseKeeper()
        {
            CreateMap<HouseKeeperDisplayDTO, Housekeeper>().ReverseMap();
            CreateMap<HouseKeeperDisplayDTO, Account>().ReverseMap();
        }

        private void Map_Create_HouseKeeper()
        {
            CreateMap<HouseKeeperCreateDTO, Housekeeper>();
        }


        private void Map_Create_Job()
        {
            CreateMap<JobCreateDTO, Job>();
            CreateMap<JobCreateDTO, JobDetail>();
        }

        private void Map_Update_Job()
        {
            CreateMap<JobUpdateDTO, Job>();
            CreateMap<JobUpdateDTO, JobDetail>();
        }

        private void Map_Create_Booking()
        {
            CreateMap<BookingCreateDTO, Booking>().ReverseMap();
        }

        private void Map_Update_Booking()
        {
            CreateMap<BookingUpdateDTO, Booking>().ReverseMap();
        }

        private void Map_Chat()
        {
            CreateMap<ChatDTO, Chat>().ReverseMap();
        }

        private void Map_List_Pending_Housekeeper()
        {
            CreateMap<HousekeeperPendingDTO, Housekeeper>();
            CreateMap<HousekeeperPendingDTO, IDVerification>();
            CreateMap<HousekeeperPendingDTO, VerificationTask>();
        }

        private void Map_Update_Withdraw()
        {
            CreateMap<WithdrawUpdateDTO, Withdraw>();
        }

        private void Map_Create_Withdraw()
        {
            CreateMap<WithdrawCreateDTO, Withdraw>();
        }

        private void Map_Display_Withdraw()
        {
            CreateMap<WithdrawDisplayDTO, Withdraw>().ReverseMap();
        }

        private void Map_Create_Service()
        {
            CreateMap<ServiceCreateDTO, Service>();
        }

        private void Map_Update_Service()
        {
            CreateMap<ServiceUpdateDTO, Service>();
        }

        private void Map_Verify_Request()
        {
            CreateMap<VerificationRequestDTO, VerificationTask>().ReverseMap();
        }

        private void Map_Create_IDVerification()
        {
            CreateMap<IDVerificationUpdateDTO, IDVerification>();
        }

        private void Map_Update_IDVerification()
        {
            CreateMap<IDVerificationUpdateDTO, IDVerification>();
        }

        private void Map_Display_IDVerification()
        {
            CreateMap<IDVerificationDisplayDTO, IDVerification>().ReverseMap();
        }

        private void Map_Display_Transaction()
        {
            CreateMap<TransactionDisplayDTO, Transaction>().ReverseMap();
        }

        private void Map_Display_Notification()
        {
            CreateMap<NotificationDisplayDTO, Notification>().ReverseMap();
        }

        private void Map_Create_Notification()
        {
            CreateMap<NotificationCreateDTO, Notification>();
        }

        private void Map_Create_Job_Service()
        {
            CreateMap<Job_ServiceCreateDTO, Job_Service>();
        }

        private void Map_Create_Job_Slots()
        {
            CreateMap<Job_SlotsCreateDTO, Job_Slots>();
        }

        private void Map_Display_Job()
        {
            CreateMap<Job, JobDetailDisplayDTO>()
                .ForMember(dest => dest.ServiceIDs, opt => opt.MapFrom(src => src.Job_Services != null ? src.Job_Services.Select(js => js.ServiceID).ToList() : new List<int>()))
                .ForMember(dest => dest.SlotIDs, opt => opt.MapFrom(src => src.Job_Slots != null ? src.Job_Slots.Select(js => js.SlotID).ToList() : new List<int>()))
                .ForMember(dest => dest.DayofWeek, opt => opt.MapFrom(src => src.Job_Slots != null ? src.Job_Slots.Select(js => js.DayOfWeek).Distinct().ToList() : new List<int>()));
            CreateMap<Job, JobDisplayDTO>();
            CreateMap<JobDetail, JobDisplayDTO>();
            CreateMap<JobDetail, JobDetailDisplayDTO>();
        }

        private void Map_Create_Booking_Slots()
        {
            CreateMap<Booking_SlotsCreateDTO, Booking_Slots>();
        }

        private void Map_Display_HouseKeeperSkill()
        {
            CreateMap<HouseKeeperSkillDisplayDTO, HouseKeeperSkill>().ReverseMap();
        }

        private void Map_Create_HouseKeeperSkill()
        {
            CreateMap<HousekeeperSkillCreateDTO, HouseKeeperSkill>();
        }

        private void Map_Update_HouseKeeperSkill()
        {
            CreateMap<HousekeeperSkillUpdateDTO, HouseKeeperSkill>();
        }

        private void Map_Display_HouseKeeperSkillMapping()
        {
            CreateMap<HousekeeperSkillMappingDisplayDTO, HousekeeperSkillMapping>().ReverseMap()
                .ForMember(dest => dest.AccountID, opt => opt.MapFrom(src => src.Housekeeper.AccountID));
        }

        private void Map_Create_HouseKeeperSkillMapping()
        {
            CreateMap<HousekeeperSkillMappingCreateDTO, HousekeeperSkillMapping>();
        }

        private void Map_Display_Violation()
        {
            CreateMap<ViolationDisplayDTO, Violation>().ReverseMap();
        }

        private void Map_Create_Violation()
        {
            CreateMap<ViolationCreateDTO, Violation>();
        }

        private void Map_Update_Violation()
        {
            CreateMap<ViolationUpdateDTO, Violation>();
        }

        private void Map_Display_Housekeeper_Violation()
        {
            CreateMap<Housekeeper_ViolationDisplayDTO, Housekeeper_Violation>().ReverseMap()
                 .ForMember(dest => dest.AccountID, opt => opt.MapFrom(src => src.Housekeeper.AccountID)); ;
        }

        private void Map_Create_Housekeeper_Violation()
        {
            CreateMap<Housekeeper_ViolationCreateDTO, Housekeeper_Violation>();
        }

        private void Map_Reset_Password()
        {
            CreateMap<ResetPasswordDTO, Account>();
        }

        private void Map_Display_Rating()
        {
            CreateMap<RatingDisplayDTO, Rating>().ReverseMap();
        }
        private void Map_OTP_Verification()
        {
            CreateMap<OTPVerificationDTO, Withdraw>().ReverseMap();
        }
        
        private void Map_Display_SupportRequest()
        {
            CreateMap<SupportRequestDisplayDTO, SupportRequest>().ReverseMap();
        }
        private void Map_Create_SupportRequest()
        {
            CreateMap<SupportRequestCreateDTO, SupportRequest>()
                .ForMember(f => f.Picture, opt => opt.Ignore());
        }

        
    }
}