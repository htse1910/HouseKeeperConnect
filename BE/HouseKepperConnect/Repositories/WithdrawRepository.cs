using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class WithdrawRepository : IWithdrawRepository
    {
        public async Task AddWithdrawAsync(Withdraw wi) => await WithdrawDAO.Instance.AddWithdrawAsync(wi);

        public async Task DeleteWithdrawAsync(int id) => await WithdrawDAO.Instance.DeleteWithdrawAsync(id);

        public async Task<List<Withdraw>> GetAllWithdrawsAsync(int pageNumber, int pageSize) => await WithdrawDAO.Instance.GetAllWithdrawsAsync(pageNumber, pageSize);

        public async Task<List<Withdraw>> GetPendingWithdrawsAsync(int pageNumber, int pageSize) => await WithdrawDAO.Instance.GetPendingWithdrawsAsync(pageNumber, pageSize);

        public async Task<int> GetTotalWithdrawAsync() => await WithdrawDAO.Instance.GetTotalWithdrawAsync();

        public async Task<Withdraw> GetWithdrawByIDAsync(int id) => await WithdrawDAO.Instance.GetWithdrawByIDAsync(id);

        public async Task<List<Withdraw>> GetWithdrawsByUserAsync(int uId, int pageNumber, int pageSize) => await WithdrawDAO.Instance.GetWithdrawsByUserAsync(uId, pageNumber, pageSize);

        public async Task<List<Withdraw>> GetWithdrawsPastWeekAsync(int pageNumber, int pageSize) => await WithdrawDAO.Instance.GetWithdrawsPastWeekAsync(pageNumber, pageSize);

        public async Task UpdateWithdrawAsync(Withdraw wi) => await WithdrawDAO.Instance.UpdateWithdrawAsync(wi);

        public async Task<bool> VerifyOTPAsync(int withdrawId, string otpCode) => await WithdrawDAO.Instance.VerifyOTPAsync(withdrawId, otpCode);
    }
}