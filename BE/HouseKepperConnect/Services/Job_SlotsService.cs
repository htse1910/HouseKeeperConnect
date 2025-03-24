using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class Job_SlotsService : IJob_SlotsService
    {
        private readonly IJob_SlotsRepository _jobSlotsRepository;

        public Job_SlotsService(IJob_SlotsRepository jobSlotsRepository)
        {
            _jobSlotsRepository = jobSlotsRepository;
        }

        public async Task<List<Job_Slots>> GetAllJob_SlotsAsync()
        {
            return await _jobSlotsRepository.GetAllJob_SlotsAsync();
        }

        public async Task<Job_Slots> GetJob_SlotsByIDAsync(int id)
        {
            return await _jobSlotsRepository.GetJob_SlotsByIDAsync(id);
        }

        public async Task<List<Job_Slots>> GetJob_SlotsByJobIDAsync(int jobId)
        {
            return await _jobSlotsRepository.GetJob_SlotsByJobIDAsync(jobId);
        }

        public async Task AddJob_SlotsAsync(Job_Slots jobSlots)
        {
            await _jobSlotsRepository.AddJob_SlotsAsync(jobSlots);
        }

        public async Task DeleteJob_SlotsAsync(int id)
        {
            await _jobSlotsRepository.DeleteJob_SlotsAsync(id);
        }
    }
}