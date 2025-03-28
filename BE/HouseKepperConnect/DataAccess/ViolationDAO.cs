using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ViolationDAO
    {
        private static ViolationDAO instance;
        public static readonly object instancelock = new object();

        public ViolationDAO()
        { }

        public static ViolationDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new ViolationDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Violation>> GetAllViolationsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Violation>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Violation.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Violation> GetViolationByIDAsync(int hID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Violation.FirstOrDefaultAsync(r => r.ViolationID == hID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddViolationAsync(Violation Violation)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Violation.Add(Violation);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteViolationAsync(int id)
        {
            var Violation = await GetViolationByIDAsync(id);
            if (Violation != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Violation.Remove(Violation);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateViolationAsync(Violation Violation)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(Violation).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
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