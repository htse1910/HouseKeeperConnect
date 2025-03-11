using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly JobDAO _jobDAO;

        public JobRepository()
        {
            _jobDAO = JobDAO.Instance;
        }

        public Task AddJobAsync(Job job) => _jobDAO.AddJobAsync(job);

        public Task AddJobDetailAsync(JobDetail jobDetail) => _jobDAO.AddJobDetailAsync(jobDetail);

        public Task DeleteJobAsync(int id) => _jobDAO.DeleteJobAsync(id);

        public Task<List<Job>> GetAllJobsAsync() => _jobDAO.GetAllJobsAsync();

        public Task<Job> GetJobByIDAsync(int id) => _jobDAO.GetJobByIDAsync(id);

        public Task<List<Job>> GetJobsByAccountIDAsync(int accountId) => _jobDAO.GetJobsByAccountIDAsync(accountId);

        public Task UpdateJobAsync(Job job) => _jobDAO.UpdateJobAsync(job);
    }
}
