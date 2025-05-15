using BusinessObject.Models;

namespace DataAccess.Interface
{
    public interface IFamilyPreferenceSkillRepository
    {
        Task<List<FamilyPreferenceSkill>> GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(int familyPreferenceId);
        Task AddFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill);
        Task UpdateFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill);
        Task DeleteFamilyPreferenceSkillAsync(int skillId);
    }
}
