using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllJobsAsync();
        Task<List<JobDetail>> GetAllDetailJobsAsync();

        Task<Job> GetJobByIDAsync(int id);

        Task<List<Job>> GetJobsByAccountIDAsync(int accountId);

        Task<JobDetail> GetJobDetailByJobIDAsync(int jobID);
        Task<List<JobDetail>> SearchJobsAsync(string name);
        Task<List<JobDetail>> SearchJobByConditionsAssync(string name, string location = null, decimal? minPrice = null, decimal? maxPrice = null, int? jobType = null);

        Task AddJobAsync(Job job);

        Task AddJobDetailAsync(JobDetail jobDetail);

        Task DeleteJobAsync(int id);

        Task UpdateJobAsync(Job job);

        Task UpdateJobDetailAsync(JobDetail jobdetail);
    }
}