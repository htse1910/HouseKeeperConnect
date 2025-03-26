using BusinessObject.Models;

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