using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class Housekeeper_ViolationRepository : IHousekeeper_ViolationRepository
    {
        public async Task<List<Housekeeper_Violation>> GetViolationByHousekeeperIdAsync(int housekeeperId) => await Housekeeper_ViolationDAO.Instance.GetViolationByHousekeeperIdAsync(housekeeperId);

        public async Task AddViolationToHousekeeperAsync(Housekeeper_Violation housekeeper_Violation) => await Housekeeper_ViolationDAO.Instance.AddViolationToHousekeeperAsync(housekeeper_Violation);

        public async Task RemoveViolationFromHousekeeperAsync(int housekeeperId, int violationId) => await Housekeeper_ViolationDAO.Instance.RemoveViolationFromHousekeeperAsync(housekeeperId, violationId);
    }
}