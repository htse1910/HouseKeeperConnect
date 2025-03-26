using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class FamilyProfileService : IFamilyProfileService
    {
        private readonly IFamilyProfileRepository _familyRepository;

        public FamilyProfileService(IFamilyProfileRepository familyRepository)
        {
            _familyRepository = familyRepository;
        }

        public async Task<List<Family>> GetAllFamilysAsync(int pageNumber, int pageSize) => await _familyRepository.GetAllFamilysAsync(pageNumber, pageSize);

        public async Task<Family> GetFamilyByIDAsync(int fID) => await _familyRepository.GetFamilyByIDAsync(fID);

        public async Task AddFamilyAsync(Family Family) => await _familyRepository.AddFamilyAsync(Family);

        public async Task DeleteFamilyAsync(int id) => await _familyRepository.DeleteFamilyAsync(id);

        public async Task UpdateFamilyAsync(Family Family) => await _familyRepository.UpdateFamilyAsync(Family);

        

        public async Task<List<Family>> SearchFamiliesByAccountIDAsync(int accountId) => await _familyRepository.SearchFamiliesByAccountIDAsync(accountId);

        public async Task<Family> GetFamilyByAccountIDAsync(int accountId) => await _familyRepository.GetFamilyByAccountIDAsync(accountId);
    }
}