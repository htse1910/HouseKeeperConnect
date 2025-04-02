using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class JobListing_ApplicationService : IJobListing_ApplicationService
    {
        private readonly IJobListing_ApplicationRepository _repository;

        public JobListing_ApplicationService(IJobListing_ApplicationRepository repository)
        {
            _repository = repository;
        }

        public async Task AddJob_ApplicationAsync(JobListing_Application noti) => await _repository.AddJob_ApplicationAsync(noti);

        public async Task DeleteJob_ApplicationAsync(int id) => await _repository.DeleteJob_ApplicationAsync(id);

        public async Task<List<JobListing_Application>> GetAllJob_ApplicationsAsync(int pageNumber, int pageSize) => await _repository.GetAllJob_ApplicationsAsync(pageNumber, pageSize);

        public async Task<List<JobListing_Application>> GetAllJob_ApplicationsByJobAsync(int uid, int pageNumber, int pageSize) => await _repository.GetAllJob_ApplicationsByJobAsync(uid, pageNumber, pageSize);

        public async Task<JobListing_Application> GetJob_ApplicationByAppAsync(int id) => await _repository.GetJob_ApplicationByAppAsync(id);

        public async Task<JobListing_Application> GetJob_ApplicationByIDAsync(int id) => await _repository.GetJob_ApplicationByIDAsync(id);

        public async Task UpdateJob_ApplicationAsync(JobListing_Application noti) => await _repository.UpdateJob_ApplicationAsync(noti);
    }
}