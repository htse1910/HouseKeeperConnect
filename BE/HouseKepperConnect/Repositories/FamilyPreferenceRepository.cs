using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class FamilyPreferenceRepository : IFamilyPreferenceRepository
    {
        private readonly FamilyPreferenceDAO _familyPreferenceDAO;

        public FamilyPreferenceRepository()
        {
            _familyPreferenceDAO = FamilyPreferenceDAO.Instance;
        }

        public async Task<FamilyPreference> GetFamilyPreferenceByIDAsync(int id) =>
            await _familyPreferenceDAO.GetFamilyPreferenceByIDAsync(id);

        public async Task<FamilyPreference> GetFamilyPreferenceByFamilyIDAsync(int familyId) =>
            await _familyPreferenceDAO.GetFamilyPreferenceByFamilyIDAsync(familyId);

        public async Task AddFamilyPreferenceAsync(FamilyPreference preference) =>
            await _familyPreferenceDAO.AddFamilyPreferenceAsync(preference);

        public async Task UpdateFamilyPreferenceAsync(FamilyPreference preference) =>
            await _familyPreferenceDAO.UpdateFamilyPreferenceAsync(preference);

        public async Task DeleteFamilyPreferenceAsync(int preferenceId) =>
            await _familyPreferenceDAO.DeleteFamilyPreferenceAsync(preferenceId);
    }
}
