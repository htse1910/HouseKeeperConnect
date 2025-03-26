using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class HousekeeperSkillMappingService : IHousekeeperSkillMappingService
    {
        private readonly IHousekeeperSkillMappingRepository _housekeeperSkillMappingRepository;
        public HousekeeperSkillMappingService(IHousekeeperSkillMappingRepository housekeeperSkillMappingRepository)
        {
            _housekeeperSkillMappingRepository = housekeeperSkillMappingRepository;
        }
        public async Task<List<HousekeeperSkillMapping>> GetSkillsByHousekeeperIdAsync(int housekeeperId) => await _housekeeperSkillMappingRepository.GetSkillsByHousekeeperIdAsync(housekeeperId);
        public async Task AddSkillToHousekeeperAsync(HousekeeperSkillMapping housekeeperMapSkill) => await _housekeeperSkillMappingRepository.AddSkillToHousekeeperAsync(housekeeperMapSkill);
        public async Task RemoveSkillFromHousekeeperAsync(int housekeeperId, int skillId) => await _housekeeperSkillMappingRepository.RemoveSkillFromHousekeeperAsync(housekeeperId, skillId);

    }
}
