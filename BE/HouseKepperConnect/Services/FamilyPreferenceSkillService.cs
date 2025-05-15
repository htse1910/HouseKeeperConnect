using BusinessObject.Models;
using DataAccess.Interface;
using Services.Interface;

namespace Services
{
    public class FamilyPreferenceSkillService : IFamilyPreferenceSkillService
    {
        private readonly IFamilyPreferenceSkillRepository _repository;

        public FamilyPreferenceSkillService(IFamilyPreferenceSkillRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<FamilyPreferenceSkill>> GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(int familyPreferenceId)
        {
            return await _repository.GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(familyPreferenceId);
        }

        public async Task AddFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill)
        {
            await _repository.AddFamilyPreferenceSkillAsync(skill);
        }

        public async Task UpdateFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill)
        {
            await _repository.UpdateFamilyPreferenceSkillAsync(skill);
        }

        public async Task DeleteFamilyPreferenceSkillAsync(int skillId)
        {
            await _repository.DeleteFamilyPreferenceSkillAsync(skillId);
        }
    }
}
