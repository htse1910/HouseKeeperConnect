using BusinessObject.Models;
using DataAccess.Interface;

namespace DataAccess
{
    public class FamilyPreferenceSkillRepository : IFamilyPreferenceSkillRepository
    {
        public async Task<List<FamilyPreferenceSkill>> GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(int familyPreferenceId)
        {
            return await FamilyPreferenceSkillDAO.Instance.GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(familyPreferenceId);
        }

        public async Task AddFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill)
        {
            await FamilyPreferenceSkillDAO.Instance.AddFamilyPreferenceSkillAsync(skill);
        }

        public async Task UpdateFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill)
        {
            await FamilyPreferenceSkillDAO.Instance.UpdateFamilyPreferenceSkillAsync(skill);
        }

        public async Task DeleteFamilyPreferenceSkillAsync(int skillId)
        {
            await FamilyPreferenceSkillDAO.Instance.DeleteFamilyPreferenceSkillAsync(skillId);
        }
    }
}
