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

        public async Task AddJobAsync(Job job)
        {
            await _jobRepository.AddJobAsync(job);
        }

        public async Task AddJobDetailAsync(JobDetail jobDetail)
        {
            await _jobRepository.AddJobDetailAsync(jobDetail);
        }

        public async Task DeleteJobAsync(int id) => await _jobRepository.DeleteJobAsync(id);

        public async Task<List<Job>> GetAllJobsAsync() => await _jobRepository.GetAllJobsAsync();

        public async Task<Job> GetJobByIDAsync(int id) => await _jobRepository.GetJobByIDAsync(id);

        public async Task<List<Job>> GetJobsByAccountIDAsync(int accountId) => await _jobRepository.GetJobsByAccountIDAsync(accountId);

        public async Task UpdateJobAsync(Job job) => await _jobRepository.UpdateJobAsync(job);
    }
}
