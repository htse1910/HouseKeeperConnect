using BusinessObject.Models;

namespace Services.Interface
{
    public interface IServiceService
    {
        Task<List<Service>> GetAllServicesAsync();

        Task<Service> GetServiceByIDAsync(int id);

        Task AddServiceAsync(Service service);

        Task UpdateServiceAsync(Service service);

        Task DeleteServiceAsync(int id);
    }
}