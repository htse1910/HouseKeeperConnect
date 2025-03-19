using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _serviceRepository;

        public ServiceService(IServiceRepository serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        public async Task<List<Service>> GetAllServicesAsync() => await _serviceRepository.GetAllServicesAsync();

        public async Task<Service> GetServiceByIDAsync(int id) => await _serviceRepository.GetServiceByIDAsync(id);

        public async Task AddServiceAsync(Service service) => await _serviceRepository.AddServiceAsync(service);

        public async Task UpdateServiceAsync(Service service) => await _serviceRepository.UpdateServiceAsync(service);

        public async Task DeleteServiceAsync(int id) => await _serviceRepository.DeleteServiceAsync(id);
    }
}
