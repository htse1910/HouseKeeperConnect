using AutoMapper;
using BusinessObject.DTO;
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
            Map_Create_IDVerification();
        }

        private void Map_List_Register()
        {
            CreateMap<Account, AccountRegisterDTO>().ReverseMap();
        }

        private void Map_List_Update_Account()
        {
            CreateMap<Account, AccountUpdateDTO>().ReverseMap();
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
            CreateMap<Family, FamilyDisplayDTO>().ReverseMap();
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

        private void Map_Create_IDVerification()
        {
            CreateMap<IDVerificationDTO, IDVerification>()
                .ForMember(f => f.FacePhoto, opt => opt.Ignore())
                .ForMember(f => f.FrontPhoto, opt => opt.Ignore())
                .ForMember(f => f.BackPhoto, opt => opt.Ignore());
        }
    }
}