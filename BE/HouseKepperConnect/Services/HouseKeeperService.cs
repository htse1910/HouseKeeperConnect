using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<List<Housekeeper>> GetAllHousekeepersAsync() => await _houseKeeperRepository.GetAllHousekeepersAsync();

        public async Task<Housekeeper> GetHousekeeperByIDAsync(int id) => await _houseKeeperRepository.GetHousekeeperByIDAsync(id);

        public async Task<Housekeeper> GetHousekeepersByUserAsync(int uId) => await _houseKeeperRepository.GetHousekeepersByUserAsync(uId);

        public async Task UpdateHousekeeperAsync(Housekeeper Housekeeper) => await _houseKeeperRepository.UpdateHousekeeperAsync(Housekeeper);
    }
}
