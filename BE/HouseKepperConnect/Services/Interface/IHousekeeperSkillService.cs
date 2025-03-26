using BusinessObject.Models;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IHousekeeperSkillService
    {
        Task<List<HouseKeeperSkill>> GetAllHouseKeeperSkillsAsync(int pageNumber, int pageSize);
        Task<HouseKeeperSkill> GetHouseKeeperSkillByIDAsync(int rID);
        Task AddHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill);
        Task DeleteHouseKeeperSkillAsync(int id);
        Task UpdateHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill);
    }
}
