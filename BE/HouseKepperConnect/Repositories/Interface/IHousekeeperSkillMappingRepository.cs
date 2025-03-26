using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IHousekeeperSkillMappingRepository
    {
        Task<List<HousekeeperSkillMapping>> GetSkillsByHousekeeperIdAsync(int housekeeperId);

        Task AddSkillToHousekeeperAsync(HousekeeperSkillMapping housekeeperMapSkill);

        Task RemoveSkillFromHousekeeperAsync(int housekeeperId, int skillId);
    }
}