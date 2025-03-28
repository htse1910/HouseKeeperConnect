using BusinessObject.Models;

namespace Services.Interface
{
    public interface IVerificationTaskService
    {
        Task<List<VerificationTask>> GetPendingTasksAsync(int pageNumber, int pageSize);

        Task<VerificationTask> GetByIdAsync(int taskId);

        Task CreateVerificationTaskAsync(VerificationTask task);

        Task UpdateVerificationTaskAsync(VerificationTask task);
    }
}