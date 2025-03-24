using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class Job_ServiceService : IJob_ServiceService
    {
        private readonly IJob_ServiceRepository _jobServiceRepository;

        public Job_ServiceService(IJob_ServiceRepository jobServiceRepository)
        {
            _jobServiceRepository = jobServiceRepository;
        }

        public async Task<List<Job_Service>> GetAllJob_ServicesAsync()
        {
            return await _jobServiceRepository.GetAllJob_ServicesAsync();
        }

        public async Task<Job_Service> GetJob_ServiceByIDAsync(int id)
        {
            return await _jobServiceRepository.GetJob_ServiceByIDAsync(id);
        }

        public async Task<List<Job_Service>> GetJob_ServicesByJobIDAsync(int jobId)
        {
            return await _jobServiceRepository.GetJob_ServicesByJobIDAsync(jobId);
        }

        public async Task AddJob_ServiceAsync(Job_Service jobService)
        {
            await _jobServiceRepository.AddJob_ServiceAsync(jobService);
        }

        public async Task DeleteJob_ServiceAsync(int id)
        {
            await _jobServiceRepository.DeleteJob_ServiceAsync(id);
        }
    }
}