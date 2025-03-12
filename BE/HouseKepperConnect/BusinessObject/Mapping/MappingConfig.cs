using AutoMapper;
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
            Mapp_List_Display_Family();
            Mapp_Update_Family();
            Map_Update_HouseKeeper();
            Map_Create_HouseKeeper();
            Map_Create_Schedule();
            Map_Update_Schedule();
            Map_Create_Job();
            Map_Update_Job();
            Map_Create_Booking();
            Map_Update_Booking();
            Map_Chat();
            Map_List_Admin_Update_Account();
        }

        private void Map_List_Register()
        {
            CreateMap<Account, AccountRegisterDTO>().ReverseMap();
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

        private void Mapp_List_Display_Family()
        {
            CreateMap<Family, FamilyDisplayDTO>()
                .ForMember(dest => dest.GenderID, opt => opt.MapFrom(src => src.Account.GenderID))
                .ForMember(dest => dest.Introduce, opt => opt.MapFrom(src => src.Account.Introduce));
        }

        private void Mapp_Update_Family()
        {
            CreateMap<Family, FamilyUpdateDTO>().ReverseMap();
        }

        private void Map_Update_HouseKeeper()
        {
            CreateMap<HouseKeeperUpdateDTO, Housekeeper>();
        }

        private void Map_Create_HouseKeeper()
        {
            CreateMap<HouseKeeperCreateDTO, Housekeeper>();
        }

        private void Map_Create_Schedule()
        {
            CreateMap<ScheduleCreateDTO, Schedule>();
        }

        private void Map_Update_Schedule()
        {
            CreateMap<ScheduleUpdateDTO, Schedule>();
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
    }
}