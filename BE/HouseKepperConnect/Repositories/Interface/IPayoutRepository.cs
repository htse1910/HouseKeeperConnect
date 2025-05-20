using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IPayoutRepository
    {
        Task<List<Payout>> GetAllPayoutsAsync(int pageNumber, int pageSize);

        Task<Payout> GetPayoutByIDAsync(int rID);

        Task<List<Payout>> GetPayoutsByHKAsync(int hkID, int pageNumber, int pageSize);
        Task<int> CountPayoutByHKAsync(int hkID);

        Task<Payout> GetPayoutByJobIDAsync(int jobID);

        Task AddPayoutAsync(Payout Payout);

        Task DeletePayoutAsync(int id);

        Task UpdatePayoutAsync(Payout Payout);
    }
}