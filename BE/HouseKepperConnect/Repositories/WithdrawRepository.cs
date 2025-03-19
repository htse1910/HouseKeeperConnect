using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class WithdrawRepository : IWithdrawRepository
    {
        public async Task AddWithdrawAsync(Withdraw wi) => await WithdrawDAO.Instance.AddWithdrawAsync(wi);

        public async Task DeleteWithdrawAsync(int id) => await WithdrawDAO.Instance.DeleteWithdrawAsync(id);

        public async Task<List<Withdraw>> GetAllWithdrawsAsync() => await WithdrawDAO.Instance.GetAllWithdrawsAsync();

        public async Task<List<Withdraw>> GetPendingWithdrawsAsync() => await WithdrawDAO.Instance.GetPendingWithdrawsAsync();

        public async Task<int> GetTotalWithdrawAsync() => await WithdrawDAO.Instance.GetTotalWithdrawAsync();

        public async Task<Withdraw> GetWithdrawByIDAsync(int id) => await WithdrawDAO.Instance.GetWithdrawByIDAsync(id);

        public async Task<List<Withdraw>> GetWithdrawsByUserAsync(int uId) => await WithdrawDAO.Instance.GetWithdrawsByUserAsync(uId);

        public async Task<List<Withdraw>> GetWithdrawsPastWeekAsync() => await WithdrawDAO.Instance.GetWithdrawsPastWeekAsync();

        public async Task UpdateWithdrawAsync(Withdraw wi) => await WithdrawDAO.Instance.UpdateWithdrawAsync(wi);
    }
}