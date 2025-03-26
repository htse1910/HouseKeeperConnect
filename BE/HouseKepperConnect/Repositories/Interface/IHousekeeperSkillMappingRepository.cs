using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IHousekeeperSkillMappingRepository
    {
        Task<List<HousekeeperSkillMapping>> GetSkillsByHousekeeperIdAsync(int housekeeperId);
        Task AddSkillToHousekeeperAsync(HousekeeperSkillMapping housekeeperMapSkill);

        Task RemoveSkillFromHousekeeperAsync(int housekeeperId, int skillId);
    }
}
