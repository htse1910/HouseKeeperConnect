using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IJob_SlotsRepository
    {
        Task<List<Job_Slots>> GetAllJob_SlotsAsync();

        Task<Job_Slots> GetJob_SlotsByIDAsync(int id);

        Task<List<Job_Slots>> GetJob_SlotsByJobIDAsync(int jobId);

        Task AddJob_SlotsAsync(Job_Slots jobSlots);

        Task DeleteJob_SlotsAsync(int id);
    }
}