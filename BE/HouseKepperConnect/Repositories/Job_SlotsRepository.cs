using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class Job_SlotsRepository : IJob_SlotsRepository
    {
        private readonly Job_SlotsDAO _jobSlotsDAO;

        public Job_SlotsRepository()
        {
            _jobSlotsDAO = Job_SlotsDAO.Instance;
        }

        public Task AddJob_SlotsAsync(Job_Slots jobSlots) => _jobSlotsDAO.AddJob_SlotAsync(jobSlots);

        public Task DeleteJob_SlotsAsync(int id) => _jobSlotsDAO.DeleteJob_SlotAsync(id);

        public Task<List<Job_Slots>> GetAllJob_SlotsAsync() => _jobSlotsDAO.GetAllJob_SlotsAsync();

        public Task<Job_Slots> GetJob_SlotsByIDAsync(int id) => _jobSlotsDAO.GetJob_SlotByIdAsync(id);

        public Task<List<Job_Slots>> GetJob_SlotsByJobIDAsync(int jobId) => _jobSlotsDAO.GetJob_SlotsByJobIdAsync(jobId);
    }
}