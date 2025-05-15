using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class FamilyPreferenceDAO
    {
        private static FamilyPreferenceDAO instance;
        private static readonly object instancelock = new object();

        public static FamilyPreferenceDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new FamilyPreferenceDAO();
                    }
                    return instance;
                }
            }
        }
        public async Task<FamilyPreference> GetFamilyPreferenceByIDAsync(int id)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.FamilyPreference
                        .AsNoTracking()
                        .FirstOrDefaultAsync(fp => fp.FamilyPreferenceID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        public async Task<FamilyPreference> GetFamilyPreferenceByFamilyIDAsync(int familyId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.FamilyPreference
                        .AsNoTracking()
                        .FirstOrDefaultAsync(fp => fp.FamilyID == familyId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddFamilyPreferenceAsync(FamilyPreference preference)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.FamilyPreference.Add(preference);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateFamilyPreferenceAsync(FamilyPreference preference)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(preference).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteFamilyPreferenceAsync(int preferenceId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var preference = await context.FamilyPreference.FindAsync(preferenceId);
                    if (preference != null)
                    {
                        context.FamilyPreference.Remove(preference);
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
