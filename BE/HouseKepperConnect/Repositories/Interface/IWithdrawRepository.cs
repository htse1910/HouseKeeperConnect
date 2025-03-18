using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IWithdrawRepository
    {
        Task<List<Withdraw>> GetAllWithdrawsAsync();

        Task<Withdraw> GetWithdrawByIDAsync(int id);

        Task<List<Withdraw>> GetWithdrawsPastWeekAsync();

        Task<List<Withdraw>> GetPendingWithdrawsAsync();

        Task<int> GetTotalWithdrawAsync();

        Task<List<Withdraw>> GetWithdrawsByUserAsync(int uId);

        Task AddWithdrawAsync(Withdraw wi);

        Task DeleteWithdrawAsync(int id);

        Task UpdateWithdrawAsync(Withdraw wi);
    }
}