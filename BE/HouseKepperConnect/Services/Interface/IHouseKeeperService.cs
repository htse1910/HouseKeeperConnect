using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IHouseKeeperService
    {
        Task<List<Housekeeper>> GetAllHousekeepersAsync();

        Task<Housekeeper> GetHousekeeperByIDAsync(int id);

        Task<Housekeeper> GetHousekeepersByUserAsync(int uId);

        Task AddHousekeeperAsync(Housekeeper Housekeeper);

        Task DeleteHousekeeperAsync(int id);

        Task UpdateHousekeeperAsync(Housekeeper Housekeeper);
    }
}
