using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;

namespace BusinessObject.Mapping
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            Map_List_Registeer();
            Map_List_Update_Account();
        }

        private void Map_List_Registeer()
        {
            CreateMap<Account, AccountRegisterDTO>().ReverseMap();
        }
        private void Map_List_Update_Account()
        {
            CreateMap<Account, AccountUpdateDTO>().ReverseMap();
        }
    }
}