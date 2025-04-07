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

        public Task<List<Job>> GetAllJobsAsync(int pageNumber, int pageSize) => _jobDAO.GetAllJobsAsync(pageNumber, pageSize);

        public Task<Job> GetJobByIDAsync(int id) => _jobDAO.GetJobByIDAsync(id);

        public Task<List<Job>> GetJobsByAccountIDAsync(int accountId, int pageNumber, int pageSize) => _jobDAO.GetJobsByAccountIDAsync(accountId, pageNumber, pageSize);

        public Task<JobDetail> GetJobDetailByJobIDAsync(int jobID) => _jobDAO.GetJobDetailByJobIDAsync(jobID);

        public Task UpdateJobAsync(Job job) => _jobDAO.UpdateJobAsync(job);

        public Task UpdateJobDetailAsync(JobDetail jobdetail) => _jobDAO.UpdateJobDetailAsync(jobdetail);

        public Task<List<JobDetail>> SearchJobByConditionsAssync(string name, string location = null, decimal? minPrice = null
            , decimal? maxPrice = null, int? jobType = null) => _jobDAO.SearchJobByConditionsAsync(name, location, minPrice, maxPrice, jobType);

        public async Task<List<JobDetail>> GetAllDetailJobsAsync(int pageNumber, int pageSize) => await _jobDAO.GetAllDetailJobsAsync(pageNumber, pageSize);

        public async Task<List<JobDetail>> SearchJobsAsync(string name, int pageNumber, int pageSize) => await _jobDAO.SearchJobsAsync(name, pageNumber, pageSize);
    }
}