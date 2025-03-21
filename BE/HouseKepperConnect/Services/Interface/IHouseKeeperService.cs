using BusinessObject.Models;

namespace Services.Interface
{
    public interface IHouseKeeperService
    {
        Task<List<Housekeeper>> GetAllHousekeepersAsync();

        Task<Housekeeper> GetHousekeeperByIDAsync(int id);

        Task<Housekeeper> GetHousekeeperByUserAsync(int uId);

        Task AddHousekeeperAsync(Housekeeper Housekeeper);

        Task DeleteHousekeeperAsync(int id);

        Task UpdateHousekeeperAsync(Housekeeper Housekeeper);

        Task<List<Housekeeper>> GetPendingHousekeepersAsync();

        Task UpdateIsVerifiedAsync(int housekeeperId, bool isVerified);
    }
}