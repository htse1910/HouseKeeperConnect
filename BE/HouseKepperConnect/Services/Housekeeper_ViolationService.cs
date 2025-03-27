using BusinessObject.Models;
using Repositories;
using Repositories.Interface;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class Housekeeper_ViolationService : IHousekeeper_ViolationService
    {
        private readonly IHousekeeper_ViolationRepository _housekeeper_ViolationRepository;
        public Housekeeper_ViolationService(IHousekeeper_ViolationRepository housekeeper_ViolationRepository)
        {
            _housekeeper_ViolationRepository = housekeeper_ViolationRepository;
        }
        public async Task<List<Housekeeper_Violation>> GetViolationByHousekeeperIdAsync(int housekeeperId) => await _housekeeper_ViolationRepository.GetViolationByHousekeeperIdAsync(housekeeperId);
        public async Task AddViolationToHousekeeperAsync(Housekeeper_Violation housekeeper_Violation) => await _housekeeper_ViolationRepository.AddViolationToHousekeeperAsync(housekeeper_Violation);
        public async Task RemoveViolationFromHousekeeperAsync(int housekeeperId, int violationId) => await _housekeeper_ViolationRepository.RemoveViolationFromHousekeeperAsync(housekeeperId, violationId);
    }
}
