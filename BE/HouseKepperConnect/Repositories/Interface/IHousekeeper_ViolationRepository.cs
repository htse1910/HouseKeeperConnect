using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IHousekeeper_ViolationRepository
    {
        Task<List<Housekeeper_Violation>> GetViolationByHousekeeperIdAsync(int housekeeperId);

        Task AddViolationToHousekeeperAsync(Housekeeper_Violation housekeeper_Violation);

        Task RemoveViolationFromHousekeeperAsync(int housekeeperId, int violationId);
    }
}