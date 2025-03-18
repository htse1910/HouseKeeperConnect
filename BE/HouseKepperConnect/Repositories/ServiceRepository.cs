using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ServiceDAO _serviceDAO;

        public ServiceRepository()
        {
            _serviceDAO = ServiceDAO.Instance;
        }

        public Task<List<Service>> GetAllServicesAsync() => _serviceDAO.GetAllServicesAsync();

        public Task<Service> GetServiceByIDAsync(int id) => _serviceDAO.GetServiceByIDAsync(id);

        public Task AddServiceAsync(Service service) => _serviceDAO.AddServiceAsync(service);

        public Task UpdateServiceAsync(Service service) => _serviceDAO.UpdateServiceAsync(service);

        public Task DeleteServiceAsync(int id) => _serviceDAO.DeleteServiceAsync(id);
    }
}
