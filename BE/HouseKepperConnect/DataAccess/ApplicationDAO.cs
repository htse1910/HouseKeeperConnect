using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ApplicationDAO
    {
        private static ApplicationDAO instance;
        private static readonly object instancelock = new object();

        public ApplicationDAO()
        { }

        public static ApplicationDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new ApplicationDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Application>> GetAllApplicationsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Application.Include(a => a.HouseKepper.Account).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }
        
        public async Task<List<Application>> GetAllApplicationsByUserAsync(int uid, int pageNumber, int pageSize)
        {
            var list = new List<Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Application.Include(a => a.HouseKepper.Account).Where(a => a.HouseKeeperID == uid).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }
        public async Task<List<Application>> GetAllApplicationsByJobIDAsync(int jobID, int pageNumber, int pageSize)
        {
            var list = new List<Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Application.Include(a => a.HouseKepper.Account).Where(a => a.JobID == jobID).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Application> GetApplicationByIDAsync(int id)
        {
            Application Application = new Application();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Application = await context.Application.Include(a => a.HouseKepper.Account).SingleOrDefaultAsync(x => x.ApplicationID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Application;
        }

        public async Task<Application> GetApplicationByHKIDAsync(int id)
        {
            Application Application = new Application();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Application = await context.Application.Include(a => a.HouseKepper.Account).SingleOrDefaultAsync(x => x.HouseKeeperID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Application;
        }

        public async Task AddApplicationAsync(Application noti)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Application.Add(noti);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteApplicationAsync(int id)
        {
            var Application = await GetApplicationByIDAsync(id);
            if (Application != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Application.Remove(Application);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateApplicationAsync(Application noti)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(noti).State = EntityState.Modified;
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