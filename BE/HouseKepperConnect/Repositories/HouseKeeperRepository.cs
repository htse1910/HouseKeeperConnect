using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class HouseKeeperRepository : IHouseKeeperRepository
    {
        public async Task AddHousekeeperAsync(Housekeeper Housekeeper) => await HousekeeperDAO.Instance.AddHousekeeperAsync(Housekeeper);

        public async Task DeleteHousekeeperAsync(int id) => await HousekeeperDAO.Instance.DeleteHousekeeperAsync(id);

        public async Task<List<Housekeeper>> GetAllHousekeepersAsync(int pageNumber, int pageSize) => await HousekeeperDAO.Instance.GetAllHousekeepersAsync(pageNumber, pageSize);

        public async Task<Housekeeper> GetHousekeeperByIDAsync(int id) => await HousekeeperDAO.Instance.GetHousekeeperByIDAsync(id);

        public async Task<Housekeeper> GetHousekeepersByUserAsync(int uId) => await HousekeeperDAO.Instance.GetHousekeepersByUserAsync(uId);

        public async Task UpdateHousekeeperAsync(Housekeeper Housekeeper) => await HousekeeperDAO.Instance.UpdateHousekeeperAsync(Housekeeper);

        public async Task<List<Housekeeper>> GetPendingHousekeepersAsync(int pageNumber, int pageSize) => await HousekeeperDAO.Instance.GetPendingHousekeepersAsync(pageNumber, pageSize);

        public async Task UpdateIsVerifiedAsync(int verifyId, bool isVerified) => await HousekeeperDAO.Instance.UpdateIsVerifiedAsync(verifyId, isVerified);

        public async Task<Housekeeper> GetHousekeepersByIDVerifyAsync(int ID) => await HousekeeperDAO.Instance.GetHousekeepersByIDVerifyAsync(ID);

        public async Task<int> CountVerifiedHousekeepersAsync() => await HousekeeperDAO.Instance.CountVerifiedHousekeepersAsync();

        public async Task<int> CountPendingHousekeepersAsync() => await HousekeeperDAO.Instance.CountPendingHousekeepersAsync();
    }
}