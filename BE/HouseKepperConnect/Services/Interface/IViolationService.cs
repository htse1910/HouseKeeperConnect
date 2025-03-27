using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IViolationService
    {
        Task<List<Violation>> GetAllViolationsAsync(int pageNumber, int pageSize);
        Task<Violation> GetViolationByIDAsync(int hID);
        Task AddViolationAsync(Violation Violation);
        Task DeleteViolationAsync(int id);
        Task UpdateViolationAsync(Violation Violation);
    }
}
