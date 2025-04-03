using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class Job_ApplicationDAO
    {
        private static Job_ApplicationDAO instance;
        private static readonly object instancelock = new object();

        public Job_ApplicationDAO()
        { }

        public static Job_ApplicationDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new Job_ApplicationDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<JobListing_Application>> GetAllJob_ApplicationsAsync(int pageNumber, int pageSize)
        {
            var list = new List<JobListing_Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.JobListing_Application.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<List<JobListing_Application>> GetAllJob_ApplicationsByJobAsync(int uid, int pageNumber, int pageSize)
        {
            var list = new List<JobListing_Application>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.JobListing_Application.Include(a => a.Application.HouseKepper.Account).Where(a => a.JobID == uid).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<JobListing_Application> GetJob_ApplicationByIDAsync(int id)
        {
            JobListing_Application j = new JobListing_Application();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    j = await context.JobListing_Application.SingleOrDefaultAsync(x => x.JobListingApplicationID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return j;
        }

        public async Task<JobListing_Application> GetJob_ApplicationByAppAsync(int id)
        {
            JobListing_Application j = new JobListing_Application();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    j = await context.JobListing_Application.Include(x => x.Job.Family.Account).SingleOrDefaultAsync(x => x.ApplicationID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return j;
        }

        public async Task AddJob_ApplicationAsync(JobListing_Application noti)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.JobListing_Application.Add(noti);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteJob_ApplicationAsync(int id)
        {
            var Job_Application = await GetJob_ApplicationByIDAsync(id);
            if (Job_Application != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.JobListing_Application.Remove(Job_Application);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateJob_ApplicationAsync(JobListing_Application noti)
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