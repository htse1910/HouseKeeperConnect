using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IHouseKeeperRepository
    {
        Task<List<Housekeeper>> GetAllHousekeepersAsync();

        Task<Housekeeper> GetHousekeeperByIDAsync(int id);

        Task<Housekeeper> GetHousekeepersByUserAsync(int uId);

        Task AddHousekeeperAsync(Housekeeper Housekeeper);

        Task DeleteHousekeeperAsync(int id);

        Task UpdateHousekeeperAsync(Housekeeper Housekeeper);
    }
}