using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IVerificationTaskRepository
    {
        Task<int> CreateVerificationTaskAsync(VerificationTask task);

        Task<List<VerificationTask>> GetPendingVerificationTasksAsync(int pageNumber, int pageSize);

        Task<bool> ApproveVerificationAsync(int taskId, int staffId, string notes);

        Task<bool> RejectVerificationAsync(int taskId, int staffId, string notes);
    }
}