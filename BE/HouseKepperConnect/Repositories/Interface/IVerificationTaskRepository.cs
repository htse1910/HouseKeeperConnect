using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IVerificationTaskRepository
    {
        
        Task<List<VerificationTask>> GetPendingTasksAsync(int pageNumber, int pageSize);

        Task<VerificationTask> GetByIdAsync(int taskId);
        Task CreateVerificationTaskAsync(VerificationTask task);
        Task UpdateVerificationTaskAsync(VerificationTask task);
    }
}