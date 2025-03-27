using AutoMapper;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class JobDAO
    {
        private readonly IMapper _mapper;
        private static JobDAO instance;
        private static readonly object instancelock = new object();

        public JobDAO()
        { }

        public static JobDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new JobDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Job>> GetAllJobsAsync()
        {
            var list = new List<Job>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Job.Include(j => j.Family).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Job> GetJobByIDAsync(int id)
        {
            Job job = new Job();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    job = await context.Job.Include(j => j.Family).SingleOrDefaultAsync(x => x.JobID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return job;
        }

        public async Task<JobDetail> GetJobDetailByJobIDAsync(int id)
        {
            JobDetail jobdetail = new JobDetail();
            try
            {
                using (var context = new PCHWFDBContext())
                    jobdetail = await context.JobDetail.SingleOrDefaultAsync(x => x.JobID == id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return jobdetail;
        }

        public async Task<List<Job>> GetJobsByAccountIDAsync(int accountId)
        {
            using var context = new PCHWFDBContext();
            return await context.Job.Where(j => j.FamilyID == accountId).ToListAsync();
        }

        public async Task<List<Job>> GetJobsPastWeekAsync()
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var oneWeekAgo = DateTime.Now.AddDays(-7);
                    var jobs = await context.Job
                .Where(x => x.UpdatedDate >= oneWeekAgo && x.Status == (int)JobStatus.Completed)
                .ToListAsync();

                    return jobs;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Job>> GetJobsVerifiedPastWeekAsync()
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var oneWeekAgo = DateTime.UtcNow.AddDays(-7);
                    var jobs = await context.Job
                .Where(x => x.UpdatedDate >= oneWeekAgo && x.Status == (int)JobStatus.Verified)
                .ToListAsync();

                    return jobs;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> GetTotalJobsAsync()
        {
            int totalJobs;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    totalJobs = await context.Job.CountAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return totalJobs;
        }

        public async Task AddJobAsync(Job job)
        {
            try
            {
                using (var context = new PCHWFDBContext()) {
                    context.Job.Add(job);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddJobDetailAsync(JobDetail jobDetail)
        {
            using var context = new PCHWFDBContext();
            context.JobDetail.Add(jobDetail);
            await context.SaveChangesAsync();
        }

        public async Task DeleteJobAsync(int id)
        {
            var job = await GetJobByIDAsync(id);
            if (job != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Job.Remove(job);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateJobAsync(Job job)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(job).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateJobDetailAsync(JobDetail jobdetail)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(jobdetail).State = EntityState.Modified;
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