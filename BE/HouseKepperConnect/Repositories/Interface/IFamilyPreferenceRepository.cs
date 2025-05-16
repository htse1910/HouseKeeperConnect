using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IFamilyPreferenceRepository
    {
        Task<FamilyPreference> GetFamilyPreferenceByIDAsync(int id);
        Task<FamilyPreference> GetFamilyPreferenceByFamilyIDAsync(int familyId);
        Task AddFamilyPreferenceAsync(FamilyPreference preference);
        Task UpdateFamilyPreferenceAsync(FamilyPreference preference);
        Task DeleteFamilyPreferenceAsync(int preferenceId);
    }
}
