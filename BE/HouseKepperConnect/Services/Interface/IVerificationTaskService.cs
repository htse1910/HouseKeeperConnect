using BusinessObject.Models;

namespace Services.Interface
{
    public interface IVerificationTaskService
    {
        Task<int> CreateVerificationTaskAsync(VerificationTask task);

        Task<List<VerificationTask>> GetPendingVerificationTasksAsync();

        Task<bool> ApproveVerificationAsync(int taskId, int staffId, string notes);

        Task<bool> RejectVerificationAsync(int taskId, int staffId, string notes);
    }
}