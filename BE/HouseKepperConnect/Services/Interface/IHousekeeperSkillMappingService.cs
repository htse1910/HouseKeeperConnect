using BusinessObject.Models;

namespace Services.Interface
{
    public interface IHousekeeperSkillMappingService
    {
        Task<List<HousekeeperSkillMapping>> GetSkillsByHousekeeperIdAsync(int housekeeperId);

        Task AddSkillToHousekeeperAsync(HousekeeperSkillMapping housekeeperMapSkill);

        Task RemoveSkillFromHousekeeperAsync(int housekeeperId, int skillId);
    }
}