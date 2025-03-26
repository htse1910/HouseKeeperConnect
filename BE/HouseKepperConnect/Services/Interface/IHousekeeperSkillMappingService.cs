using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IHousekeeperSkillMappingService
    {
        Task<List<HousekeeperSkillMapping>> GetSkillsByHousekeeperIdAsync(int housekeeperId);
        Task AddSkillToHousekeeperAsync(HousekeeperSkillMapping housekeeperMapSkill);

        Task RemoveSkillFromHousekeeperAsync(int housekeeperId, int skillId);
    }
}
