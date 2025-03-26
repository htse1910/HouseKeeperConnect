using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class HousekeeperSkillService : IHousekeeperSkillService
    {
        private readonly IHousekeeperSkillRepository _housekeeperSkillRepository;

        public HousekeeperSkillService(IHousekeeperSkillRepository housekeeperSkillRepository)
        {
            _housekeeperSkillRepository = housekeeperSkillRepository;
        }

        public async Task<List<HouseKeeperSkill>> GetAllHouseKeeperSkillsAsync(int pageNumber, int pageSize) => await _housekeeperSkillRepository.GetAllHouseKeeperSkillsAsync(pageNumber, pageSize);

        public async Task<HouseKeeperSkill> GetHouseKeeperSkillByIDAsync(int hID) => await _housekeeperSkillRepository.GetHouseKeeperSkillByIDAsync(hID);

        public async Task AddHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill) => await _housekeeperSkillRepository.AddHouseKeeperSkillAsync(HouseKeeperSkill);

        public async Task DeleteHouseKeeperSkillAsync(int id) => await _housekeeperSkillRepository.DeleteHouseKeeperSkillAsync(id);

        public async Task UpdateHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill) => await _housekeeperSkillRepository.UpdateHouseKeeperSkillAsync(HouseKeeperSkill);
    }
}