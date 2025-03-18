using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class HouseKeeperRepository : IHouseKeeperRepository
    {
        public async Task AddHousekeeperAsync(Housekeeper Housekeeper) => await HousekeeperDAO.Instance.AddHousekeeperAsync(Housekeeper);

        public async Task DeleteHousekeeperAsync(int id) => await HousekeeperDAO.Instance.DeleteHousekeeperAsync(id);

        public async Task<List<Housekeeper>> GetAllHousekeepersAsync() => await HousekeeperDAO.Instance.GetAllHousekeepersAsync();

        public async Task<Housekeeper> GetHousekeeperByIDAsync(int id) => await HousekeeperDAO.Instance.GetHousekeeperByIDAsync(id);

        public async Task<Housekeeper> GetHousekeepersByUserAsync(int uId) => await HousekeeperDAO.Instance.GetHousekeepersByUserAsync(uId);

        public async Task UpdateHousekeeperAsync(Housekeeper Housekeeper) => await HousekeeperDAO.Instance.UpdateHousekeeperAsync(Housekeeper);

        public async Task<List<Housekeeper>> GetPendingHousekeepersAsync() => await HousekeeperDAO.Instance.GetPendingHousekeepersAsync();
    }
}