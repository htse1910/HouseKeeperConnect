using BusinessObject.Models;

namespace Services.Interface
{
    public interface IVerificationTaskService
    {
        //Task<List<VerificationTask>> GetPendingTasksAsync(int pageNumber, int pageSize);

        Task<VerificationTask> GetTaskByIdAsync(int taskId);
        Task<VerificationTask> GetTaskByVerificationIdAsync(int verifyId);

        Task CreateVerificationTaskAsync(VerificationTask task);

        Task UpdateVerificationTaskAsync(VerificationTask task);
    }
}