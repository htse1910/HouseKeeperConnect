using BusinessObject.Models;

namespace Services.Interface
{
    public interface IWithdrawService
    {
        Task<List<Withdraw>> GetAllWithdrawsAsync(int pageNumber, int pageSize);

        Task<Withdraw> GetWithdrawByIDAsync(int id);

        Task<List<Withdraw>> GetWithdrawsPastWeekAsync(int pageNumber, int pageSize);

        Task<List<Withdraw>> GetPendingWithdrawsAsync(int pageNumber, int pageSize);

        Task<int> GetTotalWithdrawAsync();

        Task<List<Withdraw>> GetWithdrawsByUserAsync(int uId, int pageNumber, int pageSize);

        Task AddWithdrawAsync(Withdraw wi);

        Task DeleteWithdrawAsync(int id);

        Task UpdateWithdrawAsync(Withdraw wi);
    }
}