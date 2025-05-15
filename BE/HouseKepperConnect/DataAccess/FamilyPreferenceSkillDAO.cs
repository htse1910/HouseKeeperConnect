using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class FamilyPreferenceSkillDAO
    {
        private static FamilyPreferenceSkillDAO instance;
        private static readonly object instancelock = new object();

        public static FamilyPreferenceSkillDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new FamilyPreferenceSkillDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<FamilyPreferenceSkill>> GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(int familypreferenceId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.FamilyPreferenceSkill
                        .Where(s => s.FamilyPreferenceID == familypreferenceId)
                        .Include(s => s.HouseKeeperSkillID)
                        .AsNoTracking()
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.FamilyPreferenceSkill.Add(skill);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task UpdateFamilyPreferenceSkillAsync(FamilyPreferenceSkill skill)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var existingSkill = await context.FamilyPreferenceSkill
                        .FirstOrDefaultAsync(s => s.FamilyPreferenceSkillID == skill.FamilyPreferenceSkillID);

                    if (existingSkill != null)
                    {
                        existingSkill.FamilyPreferenceID = skill.FamilyPreferenceID;
                        existingSkill.HouseKeeperSkillID = skill.HouseKeeperSkillID;

                        context.FamilyPreferenceSkill.Update(existingSkill);
                        await context.SaveChangesAsync();
                    }
                    else
                    {
                        throw new Exception("FamilyPreferenceSkill not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteFamilyPreferenceSkillAsync(int skillId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var skill = await context.FamilyPreferenceSkill.FindAsync(skillId);
                    if (skill != null)
                    {
                        context.FamilyPreferenceSkill.Remove(skill);
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
