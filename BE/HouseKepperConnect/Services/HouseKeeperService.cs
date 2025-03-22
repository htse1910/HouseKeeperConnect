using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class HouseKeeperService : IHouseKeeperService
    {
        private readonly IHouseKeeperRepository _houseKeeperRepository;

        public HouseKeeperService(IHouseKeeperRepository houseKeeperRepository)
        {
            _houseKeeperRepository = houseKeeperRepository;
        }

        public async Task AddHousekeeperAsync(Housekeeper Housekeeper) => await _houseKeeperRepository.AddHousekeeperAsync(Housekeeper);

        public async Task DeleteHousekeeperAsync(int id) => await _houseKeeperRepository.DeleteHousekeeperAsync(id);

        public async Task<List<Housekeeper>> GetAllHousekeepersAsync(int pageNumber, int pageSize) => await _houseKeeperRepository.GetAllHousekeepersAsync(pageNumber, pageSize);

        public async Task<Housekeeper> GetHousekeeperByIDAsync(int id) => await _houseKeeperRepository.GetHousekeeperByIDAsync(id);

        public async Task<Housekeeper> GetHousekeeperByUserAsync(int uId) => await _houseKeeperRepository.GetHousekeepersByUserAsync(uId);

        public async Task UpdateHousekeeperAsync(Housekeeper Housekeeper) => await _houseKeeperRepository.UpdateHousekeeperAsync(Housekeeper);

        public async Task<List<Housekeeper>> GetPendingHousekeepersAsync(int pageNumber, int pageSize) => await _houseKeeperRepository.GetPendingHousekeepersAsync(pageNumber, pageSize);

        public async Task UpdateIsVerifiedAsync(int housekeeperId, bool isVerified) => await _houseKeeperRepository.UpdateIsVerifiedAsync(housekeeperId, isVerified);
    }
}