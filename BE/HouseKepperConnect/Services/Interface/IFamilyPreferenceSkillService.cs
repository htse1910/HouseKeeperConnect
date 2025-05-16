using BusinessObject.Models;

namespace Services.Interface
{
    public interface IFamilyPreferenceSkillService
    {
        Task<List<FamilyPreferenceSkill>> GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(int familyPreferenceId);
        Task AddFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill);
        Task UpdateFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill);
        Task DeleteFamilyPreferenceSkillAsync(int skillId);
    }
}
