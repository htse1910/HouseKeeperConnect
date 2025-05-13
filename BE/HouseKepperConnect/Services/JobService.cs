using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _jobRepository;

        public JobService(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        public async Task AddJobAsync(Job job) => await _jobRepository.AddJobAsync(job);

        public async Task AddJobDetailAsync(JobDetail jobDetail) => await _jobRepository.AddJobDetailAsync(jobDetail);

        public async Task DeleteJobAsync(int id) => await _jobRepository.DeleteJobAsync(id);

        public async Task<List<Job>> GetAllJobsAsync() => await _jobRepository.GetAllJobsAsync();

        public async Task<Job> GetJobByIDAsync(int id) => await _jobRepository.GetJobByIDAsync(id);

        public async Task<List<Job>> GetJobsByAccountIDAsync(int accountId, int pageNumber, int pageSize) => await _jobRepository.GetJobsByAccountIDAsync(accountId, pageNumber, pageSize);

        public async Task<JobDetail> GetJobDetailByJobIDAsync(int jobID) => await _jobRepository.GetJobDetailByJobIDAsync(jobID);

        public async Task UpdateJobAsync(Job job) => await _jobRepository.UpdateJobAsync(job);

        public async Task UpdateJobDetailAsync(JobDetail jobdetail) => await _jobRepository.UpdateJobDetailAsync(jobdetail);

        public async Task<List<JobDetail>> SearchJobByConditionsAssync(string name, string location = null, decimal? minPrice = null,
            decimal? maxPrice = null, int? jobType = null) => await _jobRepository.SearchJobByConditionsAssync(name, location, minPrice, maxPrice, jobType);

        public async Task<List<JobDetail>> GetAllDetailJobsAsync(int pageNumber, int pageSize) => await _jobRepository.GetAllDetailJobsAsync(pageNumber, pageSize);

        public async Task<List<JobDetail>> SearchJobsAsync(string name, int pageNumber, int pageSize) => await _jobRepository.SearchJobsAsync(name, pageNumber, pageSize);

        public async Task<List<Job>> GetJobsOfferedByHKAsync(int hktId, int pageNumber, int pageSize) => await _jobRepository.GetJobsOfferedByHKAsync(hktId, pageNumber, pageSize);

        public async Task<List<Job>> GetAllPendingJobsAsync() => await _jobRepository.GetAllPendingJobsAsync();

        public async Task<int> CountVerifiedJobsAsync() => await _jobRepository.CountVerifiedJobsAsync();

        public async Task<int> CountPendingJobsAsync() => await _jobRepository.CountPendingJobsAsync();

        public async Task<int> CountJobsByAccountIDAsync(int familyID) => await _jobRepository.CountJobsByAccountIDAsync(familyID);

        public async Task<int> CountJobsOfferByAccountIDAsync(int housekeeperID) => await _jobRepository.CountJobsOfferByAccountIDAsync(housekeeperID);
    }
}