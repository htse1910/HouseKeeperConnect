using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class FamilyPreferenceService : IFamilyPreferenceService
    {
        private readonly IFamilyPreferenceRepository _familyPreferenceRepository;

        public FamilyPreferenceService(IFamilyPreferenceRepository familyPreferenceRepository)
        {
            _familyPreferenceRepository = familyPreferenceRepository;
        }

        public async Task<FamilyPreference> GetPreferenceByIDAsync(int id) =>
            await _familyPreferenceRepository.GetFamilyPreferenceByIDAsync(id);

        public async Task<FamilyPreference> GetPreferenceByFamilyIDAsync(int familyId) =>
            await _familyPreferenceRepository.GetFamilyPreferenceByFamilyIDAsync(familyId);

        public async Task AddFamilyPreferenceAsync(FamilyPreference preference) =>
            await _familyPreferenceRepository.AddFamilyPreferenceAsync(preference);

        public async Task UpdateFamilyPreferenceAsync(FamilyPreference preference) =>
            await _familyPreferenceRepository.UpdateFamilyPreferenceAsync(preference);

        public async Task DeleteFamilyPreferenceAsync(int preferenceId) =>
            await _familyPreferenceRepository.DeleteFamilyPreferenceAsync(preferenceId);
    }
}
