using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class PlatformFeeDAO
    {
        private static PlatformFeeDAO instance;
        public static readonly object instancelock = new object();

        public PlatformFeeDAO()
        { }

        public static PlatformFeeDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new PlatformFeeDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<PlatformFee>> GetAllPlatformFeesAsync(int pageNumber, int pageSize)
        {
            var list = new List<PlatformFee>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.PlatformFee.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<PlatformFee> GetPlatformFeeByIDAsync(int fID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.PlatformFee.FirstOrDefaultAsync(r => r.FeeID == fID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddPlatformFeeAsync(PlatformFee PlatformFee)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.PlatformFee.Add(PlatformFee);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeletePlatformFeeAsync(int id)
        {
            var PlatformFee = await GetPlatformFeeByIDAsync(id);
            if (PlatformFee != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.PlatformFee.Remove(PlatformFee);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdatePlatformFeeAsync(PlatformFee PlatformFee)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(PlatformFee).State = EntityState.Modified;
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