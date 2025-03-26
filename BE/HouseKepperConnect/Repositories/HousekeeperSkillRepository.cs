using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class HousekeeperSkillRepository : IHousekeeperSkillRepository
    {
        public async Task<List<HouseKeeperSkill>> GetAllHouseKeeperSkillsAsync(int pageNumber, int pageSize) => await HousekeeperSkillDAO.Instance.GetAllHouseKeeperSkillsAsync(pageNumber, pageSize);
        public async Task<HouseKeeperSkill> GetHouseKeeperSkillByIDAsync(int hID) => await HousekeeperSkillDAO.Instance.GetHouseKeeperSkillByIDAsync(hID);
        public async Task AddHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill) => await HousekeeperSkillDAO.Instance.AddHouseKeeperSkillAsync(HouseKeeperSkill);
        public async Task DeleteHouseKeeperSkillAsync(int id) => await HousekeeperSkillDAO.Instance.DeleteHouseKeeperSkillAsync(id);
        public async Task UpdateHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill) => await HousekeeperSkillDAO.Instance.UpdateHouseKeeperSkillAsync(HouseKeeperSkill);
    }
}
