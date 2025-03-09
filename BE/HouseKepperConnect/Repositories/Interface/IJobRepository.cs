using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllJobsAsync();

        Task<Job> GetJobByIDAsync(int id);

        Task<List<Job>> GetJobsByAccountIDAsync(int accountId);

        Task AddJobAsync(Job job);
        Task AddJobDetailAsync(JobDetail jobDetail);

        Task DeleteJobAsync(int id);

        Task UpdateJobAsync(Job job);
    }
}
