using BusinessObject.Models;

namespace Services.Interface
{
    public interface IFamilyPreferenceService
    {
        Task<FamilyPreference> GetPreferenceByIDAsync(int id);
        Task<FamilyPreference> GetPreferenceByFamilyIDAsync(int familyId);
        Task AddFamilyPreferenceAsync(FamilyPreference preference);
        Task UpdateFamilyPreferenceAsync(FamilyPreference preference);
        Task DeleteFamilyPreferenceAsync(int preferenceId);
    }
}
