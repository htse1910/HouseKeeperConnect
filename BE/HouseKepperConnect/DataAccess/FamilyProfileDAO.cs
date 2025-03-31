using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class FamilyProfileDAO
    {
        private static FamilyProfileDAO instance;
        private static readonly object instancelock = new object();

        public FamilyProfileDAO()
        { }

        public static FamilyProfileDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new FamilyProfileDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Family>> GetAllFamilysAsync(int pageNumber, int pageSize)
        {
            var list = new List<Family>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Family.Include(a => a.Account).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Family> GetFamilyByIDAsync(int fID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Family.SingleOrDefaultAsync(x => x.FamilyID == fID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Family> GetFamilyByAccountIDAsync(int accountID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Family.Include(f => f.Account).SingleOrDefaultAsync(x => x.AccountID == accountID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddFamilyAsync(Family Family)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Family.Add(Family);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteFamilyAsync(int id)
        {
            var Family = await GetFamilyByIDAsync(id);
            if (Family != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Family.Remove(Family);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateFamilyAsync(Family Family)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(Family).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Family>> SearchFamiliesByAccountIDAsync(int accountId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Family
                        .Include(f => f.Account)
                        .Where(f => f.AccountID == accountId)
                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}