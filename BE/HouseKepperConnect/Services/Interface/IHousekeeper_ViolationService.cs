using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IHousekeeper_ViolationService
    {
        Task<List<Housekeeper_Violation>> GetViolationByHousekeeperIdAsync(int housekeeperId);
        Task AddViolationToHousekeeperAsync(Housekeeper_Violation housekeeper_Violation);
        Task RemoveViolationFromHousekeeperAsync(int housekeeperId, int violationId);
    }
}
