using BusinessObject.Models;

namespace Services.Interface
{
    public interface IHouseKeeperService
    {
        Task<List<Housekeeper>> GetAllHousekeepersAsync(int pageNumber, int pageSize);

        Task<Housekeeper> GetHousekeeperByIDAsync(int id);

        Task<Housekeeper> GetHousekeeperByUserAsync(int uId);

        Task<Housekeeper> GetHousekeepersByIDVerifyAsync(int ID);

        Task AddHousekeeperAsync(Housekeeper Housekeeper);

        Task DeleteHousekeeperAsync(int id);

        Task UpdateHousekeeperAsync(Housekeeper Housekeeper);

        Task<List<Housekeeper>> GetPendingHousekeepersAsync(int pageNumber, int pageSize);

        Task UpdateIsVerifiedAsync(int verifyId, bool isVerified);
    }
}