using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _repository;

        public ApplicationService(IApplicationRepository repository)
        {
            _repository = repository;
        }

        public async Task AddApplicationAsync(Application noti) => await _repository.AddApplicationAsync(noti);

        public async Task DeleteApplicationAsync(int id) => await _repository.DeleteApplicationAsync(id);

        public async Task<List<Application>> GetAllApplicationsAsync(int pageNumber, int pageSize) => await _repository.GetAllApplicationsAsync(pageNumber, pageSize);

        public async Task<List<Application>> GetAllApplicationsByJobIDAsync(int jobID, int pageNumber, int pageSize) => await _repository.GetAllApplicationsByJobIDAsync(jobID, pageNumber, pageSize);

        public async Task<List<Application>> GetAllApplicationsByUserAsync(int uid, int pageNumber, int pageSize) => await _repository.GetAllApplicationsByUserAsync(uid, pageNumber, pageSize);

        public async Task<Application> GetApplicationByHKIDAsync(int id) => await _repository.GetApplicationByHKIDAsync(id);

        public async Task<Application> GetApplicationByIDAsync(int id) => await _repository.GetApplicationByIDAsync(id);

        public async Task UpdateApplicationAsync(Application noti) => await _repository.UpdateApplicationAsync(noti);
    }
}