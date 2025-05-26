using BusinessObject.Models;
using BusinessObject.Models.Enum;
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

        public async Task<int> CountApplicationsByHKIDAsync(int housekeeperID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Application
                        .AsNoTracking()
                        .CountAsync(j => j.HouseKeeperID == housekeeperID)
                        .ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> CountApplicationsByJobIDAsync(int jobID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Application
                        .AsNoTracking()
                        .CountAsync(j => j.JobID == jobID && j.Status != (int)ApplicationStatus.Denied)
                        .ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> CountPendingApplicationsByHKAsync(int housekeeperID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Application
                        .AsNoTracking()
                        .CountAsync(j => j.Status == (int)ApplicationStatus.Pending && j.HouseKeeperID == housekeeperID)
                        .ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> CountAcceptedApplicationsByHKAsync(int housekeeperID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Application
                        .AsNoTracking()
                        .CountAsync(j => j.Status == (int)ApplicationStatus.Accepted && j.HouseKeeperID == housekeeperID)
                        .ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> CountDenieddApplicationsByHKAsync(int housekeeperID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Application
                        .AsNoTracking()
                        .CountAsync(j => j.Status == (int)ApplicationStatus.Denied && j.HouseKeeperID == housekeeperID)
                        .ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Application>> GetAllApplicationsByUserAsync(int uid, int pageNumber, int pageSize)
        {
            var list = new List<Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Application.Include(a => a.HouseKepper.Account).Include( j=> j.Job).Include(a => a.Job.Family).Include(a => a.Job.Family.Account).Where(a => a.HouseKeeperID == uid).OrderByDescending(j => j.CreatedDate).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<List<Application>> GetAllApplicationsByUserAsync(int uid)
        {
            var list = new List<Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Application.Include(a => a.HouseKepper.Account).Include(a => a.Job.Family).Where(a => a.HouseKeeperID == uid).OrderByDescending(j => j.CreatedDate).AsNoTracking().ToListAsync();
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

        public async Task<List<Application>> GetAllApplicationsByJobIDAsync(int jobID)
        {
            var list = new List<Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Application.Include(a => a.HouseKepper).Include(a => a.HouseKepper.Account).Where(a => a.JobID == jobID && a.Status != (int)ApplicationStatus.Denied).AsNoTracking().ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }
        
        public async Task<List<Application>> GetApplicationsByJobIDAsync(int jobID)
        {
            var list = new List<Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Application.Include(a => a.HouseKepper).Include(a => a.HouseKepper.Account).Where(a => a.JobID == jobID).AsNoTracking().ToListAsync();
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