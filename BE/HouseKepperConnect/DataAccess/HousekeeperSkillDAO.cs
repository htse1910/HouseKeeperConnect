using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class HousekeeperSkillDAO
    {
        private static HousekeeperSkillDAO instance;
        public static readonly object instancelock = new object();

        public HousekeeperSkillDAO()
        { }

        public static HousekeeperSkillDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new HousekeeperSkillDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<HouseKeeperSkill>> GetAllHouseKeeperSkillsAsync(int pageNumber, int pageSize)
        {
            var list = new List<HouseKeeperSkill>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.HouseKeeperSkill.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<HouseKeeperSkill> GetHouseKeeperSkillByIDAsync(int hID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.HouseKeeperSkill.FirstOrDefaultAsync(r => r.HouseKeeperSkillID == hID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.HouseKeeperSkill.Add(HouseKeeperSkill);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteHouseKeeperSkillAsync(int id)
        {
            var HouseKeeperSkill = await GetHouseKeeperSkillByIDAsync(id);
            if (HouseKeeperSkill != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.HouseKeeperSkill.Remove(HouseKeeperSkill);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateHouseKeeperSkillAsync(HouseKeeperSkill HouseKeeperSkill)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(HouseKeeperSkill).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}