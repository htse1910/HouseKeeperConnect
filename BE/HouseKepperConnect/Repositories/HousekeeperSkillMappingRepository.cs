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
    public class HousekeeperSkillMappingRepository : IHousekeeperSkillMappingRepository
    {
        public async Task<List<HousekeeperSkillMapping>> GetSkillsByHousekeeperIdAsync(int housekeeperId) => await HousekeeperSkillMappingDAO.Instance.GetSkillsByHousekeeperIdAsync(housekeeperId);
        public async Task AddSkillToHousekeeperAsync(HousekeeperSkillMapping housekeeperMapSkill) => await HousekeeperSkillMappingDAO.Instance.AddSkillToHousekeeperAsync(housekeeperMapSkill);
        public async Task RemoveSkillFromHousekeeperAsync(int housekeeperId, int skillId) => await HousekeeperSkillMappingDAO.Instance.RemoveSkillFromHousekeeperAsync(housekeeperId, skillId);
    }
}
