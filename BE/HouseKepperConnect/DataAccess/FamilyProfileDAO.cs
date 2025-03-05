using AutoMapper;
using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class FamilyProfileDAO
    {
        private readonly IMapper _mapper;
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

        public async Task<List<Family>> GetAllFamilysAsync()
        {
            var list = new List<Family>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Family.ToListAsync();
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
            Family Family;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Family = await context.Family.SingleOrDefaultAsync(x => x.Id == fID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Family;
        }

        public async Task<List<Family>> SearchFamilysByNameAsync(string name)
        {
            var list = new List<Family>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Family.Where(u => u.Nickname.Contains(name)).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
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
    }
}