using BusinessObject.Models;

namespace Services.Interface
{
    public interface IHousekeeper_ViolationService
    {
        Task<List<Housekeeper_Violation>> GetViolationByHousekeeperIdAsync(int housekeeperId);

        Task AddViolationToHousekeeperAsync(Housekeeper_Violation housekeeper_Violation);

        Task RemoveViolationFromHousekeeperAsync(int housekeeperId, int violationId);
    }
}