using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class HousekeeperSkillMappingDAO
    {
        private static HousekeeperSkillMappingDAO instance;
        private static readonly object instanceLock = new object();

        private HousekeeperSkillMappingDAO()
        { }

        public static HousekeeperSkillMappingDAO Instance
        {
            get
            {
                lock (instanceLock)
                {
                    if (instance == null)
                    {
                        instance = new HousekeeperSkillMappingDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<HousekeeperSkillMapping>> GetSkillsByHousekeeperIdAsync(int housekeeperId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.HousekeeperSkillMapping
                        .Where(hs => hs.HousekeeperID == housekeeperId)
                        .Include(hs => hs.HouseKeeperSkill)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddSkillToHousekeeperAsync(HousekeeperSkillMapping housekeeperMapSkill)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.HousekeeperSkillMapping.Add(housekeeperMapSkill);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task RemoveSkillFromHousekeeperAsync(int housekeeperId, int skillId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var entity = await context.HousekeeperSkillMapping
                        .FirstOrDefaultAsync(hs => hs.HousekeeperID == housekeeperId && hs.HouseKeeperSkillID == skillId);
                    if (entity != null)
                    {
                        context.HousekeeperSkillMapping.Remove(entity);
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