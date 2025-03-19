using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IServiceRepository
    {
        Task<List<Service>> GetAllServicesAsync();

        Task<Service> GetServiceByIDAsync(int id);

        Task AddServiceAsync(Service service);

        Task UpdateServiceAsync(Service service);

        Task DeleteServiceAsync(int id);
    }
}