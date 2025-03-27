using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class ViolationRepository : IViolationRepository
    {
        public async Task<List<Violation>> GetAllViolationsAsync(int pageNumber, int pageSize) => await ViolationDAO.Instance.GetAllViolationsAsync(pageNumber, pageSize);  
        public async Task<Violation> GetViolationByIDAsync(int hID) => await ViolationDAO.Instance.GetViolationByIDAsync(hID);
        public async Task AddViolationAsync(Violation Violation) => await ViolationDAO.Instance.AddViolationAsync(Violation);
        public async Task DeleteViolationAsync(int id) => await ViolationDAO.Instance.DeleteViolationAsync(id);
        public async Task UpdateViolationAsync(Violation Violation) => await ViolationDAO.Instance.UpdateViolationAsync(Violation);
    }
}
