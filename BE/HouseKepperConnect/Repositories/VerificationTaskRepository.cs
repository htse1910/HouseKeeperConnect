using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class VerificationTaskRepository : IVerificationTaskRepository
    {
        public async Task<int> CreateVerificationTaskAsync(VerificationTask task) => await VerificationTaskDAO.Instance.CreateVerificationTaskAsync(task);
        public async Task<List<VerificationTask>> GetPendingVerificationTasksAsync() => await VerificationTaskDAO.Instance.GetPendingVerificationTasksAsync();
        public async Task<bool> ApproveVerificationAsync(int taskId, int staffId, string notes) => await VerificationTaskDAO.Instance.ApproveVerificationAsync(taskId, staffId, notes);
        public async Task<bool> RejectVerificationAsync(int taskId, int staffId, string notes) => await VerificationTaskDAO.Instance.RejectVerificationAsync(taskId, staffId, notes);
    }
}