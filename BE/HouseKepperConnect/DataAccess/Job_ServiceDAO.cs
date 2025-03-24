using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class Job_ServiceDAO
    {
        private static Job_ServiceDAO instance;
        private static readonly object instanceLock = new object();

        public static Job_ServiceDAO Instance
        {
            get
            {
                lock (instanceLock)
                {
                    if (instance == null)
                    {
                        instance = new Job_ServiceDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Job_Service>> GetAllJob_ServicesAsync()
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Service.Include(js => js.Job).Include(js => js.Service).ToListAsync();
        }

        public async Task<Job_Service> GetJob_ServiceByIdAsync(int id)
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Service.Include(js => js.Job).Include(js => js.Service)
                .SingleOrDefaultAsync(js => js.Job_ServiceId == id);
        }

        public async Task<List<Job_Service>> GetJob_ServicesByJobIdAsync(int jobId)
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Service.Where(js => js.JobID == jobId).Include(js => js.Service).ToListAsync();
        }

        public async Task<List<Job_Service>> GetJob_ServicesByServiceIdAsync(int serviceId)
        {
            using var context = new PCHWFDBContext();
            return await context.Job_Service.Where(js => js.ServiceID == serviceId).Include(js => js.Job).ToListAsync();
        }

        public async Task AddJob_ServiceAsync(Job_Service jobService)
        {
            using var context = new PCHWFDBContext();
            context.Job_Service.Add(jobService);
            await context.SaveChangesAsync();
        }

        public async Task DeleteJob_ServiceAsync(int id)
        {
            using var context = new PCHWFDBContext();
            var jobService = await context.Job_Service.FindAsync(id);
            if (jobService != null)
            {
                context.Job_Service.Remove(jobService);
                await context.SaveChangesAsync();
            }
        }
    }
}