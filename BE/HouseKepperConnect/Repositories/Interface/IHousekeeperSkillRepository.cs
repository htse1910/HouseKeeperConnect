using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IHousekeeperSkillRepository
    {
        Task<List<HouseKeeperSkill>> GetAllHouseKeeperSkillsAsync(int pageNumber, int pageSize);
        Task<HouseKeeperSkill> GetHouseKeeperSkillByIDAsync(int rID);
        Task AddHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill);
        Task DeleteHouseKeeperSkillAsync(int id);
        Task UpdateHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill);
    }
}
