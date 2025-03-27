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
    public class ViolationService : IViolationService
    {
        private readonly IViolationRepository _violationRepository;
        public ViolationService(IViolationRepository violationRepository)
        {
            _violationRepository = violationRepository;
        }
        public async Task<List<Violation>> GetAllViolationsAsync(int pageNumber, int pageSize) => await _violationRepository.GetAllViolationsAsync(pageNumber, pageSize);
        public async Task<Violation> GetViolationByIDAsync(int hID) => await _violationRepository.GetViolationByIDAsync(hID);
        public async Task AddViolationAsync(Violation Violation) => await _violationRepository.AddViolationAsync(Violation);
        public async Task DeleteViolationAsync(int id) => await _violationRepository.DeleteViolationAsync(id);
        public async Task UpdateViolationAsync(Violation Violation) => await _violationRepository.UpdateViolationAsync(Violation);
    }
}
