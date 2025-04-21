using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class VerificationTaskService : IVerificationTaskService
    {
        private readonly IVerificationTaskRepository _verificationTaskRepository;

        public VerificationTaskService(IVerificationTaskRepository verificationTaskRepository)
        {
            _verificationTaskRepository = verificationTaskRepository;
        }

        //public async Task<List<VerificationTask>> GetPendingTasksAsync(int pageNumber, int pageSize) => await _verificationTaskRepository.GetPendingTasksAsync(pageNumber, pageSize);

        public async Task<VerificationTask> GetTaskByIdAsync(int taskId) => await _verificationTaskRepository.GetTaskByIdAsync(taskId);

        public async Task<VerificationTask> GetTaskByVerificationIdAsync(int verifyId) => await _verificationTaskRepository.GetTaskByVerificationIdAsync(verifyId);

        public async Task CreateVerificationTaskAsync(VerificationTask task) => await _verificationTaskRepository.CreateVerificationTaskAsync(task);

        public async Task UpdateVerificationTaskAsync(VerificationTask task) => await _verificationTaskRepository.UpdateVerificationTaskAsync(task);
    }
}