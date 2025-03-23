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

        public async Task<int> CreateVerificationTaskAsync(VerificationTask task) => await _verificationTaskRepository.CreateVerificationTaskAsync(task);

        public async Task<List<VerificationTask>> GetPendingVerificationTasksAsync(int pageNumber, int pageSize) => await _verificationTaskRepository.GetPendingVerificationTasksAsync(pageNumber, pageSize);

        public async Task<bool> ApproveVerificationAsync(int taskId, int staffId, string notes) => await _verificationTaskRepository.ApproveVerificationAsync(taskId, staffId, notes);

        public async Task<bool> RejectVerificationAsync(int taskId, int staffId, string notes) => await _verificationTaskRepository.RejectVerificationAsync(taskId, staffId, notes);
    }
}