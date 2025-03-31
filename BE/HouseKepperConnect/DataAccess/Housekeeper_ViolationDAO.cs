using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class Housekeeper_ViolationDAO
    {
        private static Housekeeper_ViolationDAO instance;
        private static readonly object instanceLock = new object();

        private Housekeeper_ViolationDAO()
        { }

        public static Housekeeper_ViolationDAO Instance
        {
            get
            {
                lock (instanceLock)
                {
                    if (instance == null)
                    {
                        instance = new Housekeeper_ViolationDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Housekeeper_Violation>> GetViolationByHousekeeperIdAsync(int housekeeperId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Housekeeper_Violation
                        .Where(hs => hs.HousekeeperID == housekeeperId)
                        .Include(hs => hs.Housekeeper)
                        .Include(hs => hs.Violation)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddViolationToHousekeeperAsync(Housekeeper_Violation housekeeper_Violation)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Housekeeper_Violation.Add(housekeeper_Violation);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task RemoveViolationFromHousekeeperAsync(int housekeeperId, int violationId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var entity = await context.Housekeeper_Violation
                        .FirstOrDefaultAsync(v => v.HousekeeperID == housekeeperId && v.ViolationID == violationId);
                    if (entity != null)
                    {
                        context.Housekeeper_Violation.Remove(entity);
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