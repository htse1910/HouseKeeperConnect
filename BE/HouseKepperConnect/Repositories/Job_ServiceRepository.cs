using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class Job_ServiceRepository : IJob_ServiceRepository
    {
        private readonly Job_ServiceDAO _jobServiceDAO;

        public Job_ServiceRepository()
        {
            _jobServiceDAO = Job_ServiceDAO.Instance;
        }

        public Task AddJob_ServiceAsync(Job_Service jobService) => _jobServiceDAO.AddJob_ServiceAsync(jobService);

        public Task DeleteJob_ServiceAsync(int id) => _jobServiceDAO.DeleteJob_ServiceAsync(id);

        public Task<List<Job_Service>> GetAllJob_ServicesAsync() => _jobServiceDAO.GetAllJob_ServicesAsync();

        public Task<Job_Service> GetJob_ServiceByIDAsync(int id) => _jobServiceDAO.GetJob_ServiceByIdAsync(id);

        public Task<List<Job_Service>> GetJob_ServicesByJobIDAsync(int jobId) => _jobServiceDAO.GetJob_ServicesByJobIdAsync(jobId);
    }
}