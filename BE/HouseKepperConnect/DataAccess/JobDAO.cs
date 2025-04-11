using AutoMapper;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Mvc.RazorPages;
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

        public async Task<List<Job>> GetAllJobsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Job>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Job.Include(j => j.Family).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<List<JobDetail>> SearchJobsAsync(string name, int pageNumber, int pageSize)
        {
            var list = new List<JobDetail>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.JobDetail.Include(j => j.Job).Include(j => j.Job.Family)
                        .Where(j => j.Job.JobName.Contains(name) && j.Job.Status == (int)JobStatus.Verified && j.HousekeeperID == null).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<List<JobDetail>> GetAllDetailJobsAsync(int pageNumber, int pageSize)
        {
            var list = new List<JobDetail>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.JobDetail.Include(j => j.Job).Include(j => j.Job.Family).Include(j => j.Job.Family.Account).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
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
                    job = await context.Job.Include(j => j.Family.Account).SingleOrDefaultAsync(x => x.JobID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return job;
        }

        public async Task<List<JobDetail>> SearchJobByConditionsAsync(string name, string location = null, decimal? minPrice = null, decimal? maxPrice = null, int? jobType = null)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var query = context.JobDetail.Include(j => j.Job).AsQueryable();

                    // Filter by job name
                    if (!string.IsNullOrWhiteSpace(name))
                    {
                        query = query.Where(j => j.Job.JobName.Contains(name));
                    }

                    // Filter by location
                    if (!string.IsNullOrWhiteSpace(location))
                    {
                        query = query.Where(j => j.Location.Contains(location));
                    }

                    // Filter by price range
                    if (minPrice.HasValue)
                    {
                        query = query.Where(j => j.Price >= minPrice.Value);
                    }
                    if (maxPrice.HasValue)
                    {
                        query = query.Where(j => j.Price <= maxPrice.Value);
                    }

                    // Filter by job type (as an integer)
                    if (jobType.HasValue)
                    {
                        query = query.Where(j => j.Job.JobType == jobType.Value);
                    }

                    return await query.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<JobDetail> GetJobDetailByJobIDAsync(int id)
        {
            JobDetail jobdetail = new JobDetail();
            try
            {
                using (var context = new PCHWFDBContext())
                    jobdetail = await context.JobDetail.Include(x => x.Housekeeper).SingleOrDefaultAsync(x => x.JobID == id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return jobdetail;
        }

        public async Task<List<Job>> GetJobsByAccountIDAsync(int accountId, int pageNumber, int pageSize)
        {
            using var context = new PCHWFDBContext();
            return await context.Job.Where(j => j.FamilyID == accountId).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        }
        public async Task<List<Job>> GetJobsOfferedByHKAsync(int hktId, int pageNumber, int pageSize)
        {
            using var context = new PCHWFDBContext();
            return await context.Job.Include(j => j.JobDetail).Where(j => j.JobDetail.HousekeeperID==hktId && j.JobDetail.IsOffered==true).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task<List<Job>> GetJobsPastWeekAsync(int pageNumber, int pageSize)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var oneWeekAgo = DateTime.Now.AddDays(-7);
                    var jobs = await context.Job
                .Where(x => x.UpdatedDate >= oneWeekAgo && x.Status == (int)JobStatus.Completed).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

                    return jobs;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Job>> GetJobsVerifiedPastWeekAsync(int pageNumber, int pageSize)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var oneWeekAgo = DateTime.Now.AddDays(-7);
                    var jobs = await context.Job
                .Where(x => x.UpdatedDate >= oneWeekAgo && x.Status == (int)JobStatus.Verified).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

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
                using (var context = new PCHWFDBContext())
                {
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