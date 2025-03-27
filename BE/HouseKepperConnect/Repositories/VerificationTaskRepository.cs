using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class VerificationTaskRepository : IVerificationTaskRepository
    {
        
        public async Task<List<VerificationTask>> GetPendingTasksAsync(int pageNumber, int pageSize) => await VerificationTaskDAO.Instance.GetPendingTasksAsync(pageNumber, pageSize);  
        public async Task<VerificationTask> GetByIdAsync(int taskId) => await VerificationTaskDAO.Instance.GetByIdAsync(taskId);
        public async Task CreateVerificationTaskAsync(VerificationTask task) => await VerificationTaskDAO.Instance.CreateVerificationTaskAsync(task);
        public async Task UpdateVerificationTaskAsync(VerificationTask task) => await VerificationTaskDAO.Instance.UpdateVerificationTaskAsync(task);



    }
}