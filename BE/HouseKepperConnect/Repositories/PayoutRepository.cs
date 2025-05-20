using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class PayoutRepository : IPayoutRepository
    {
        public async Task AddPayoutAsync(Payout Payout) => await PayoutDAO.Instance.AddPayoutAsync(Payout);

        public async Task DeletePayoutAsync(int id) => await PayoutDAO.Instance.DeletePayoutAsync(id);

        public async Task<List<Payout>> GetAllPayoutsAsync(int pageNumber, int pageSize) => await PayoutDAO.Instance.GetAllPayoutsAsync(pageNumber, pageSize);

        public async Task<Payout> GetPayoutByIDAsync(int rID) => await PayoutDAO.Instance.GetPayoutByIDAsync(rID);

        public async Task<List<Payout>> GetPayoutsByHKAsync(int hkID, int pageNumber, int pageSize) => await PayoutDAO.Instance.GetPayoutsByHKAsync(hkID, pageNumber, pageSize);

        public async Task<Payout> GetPayoutByJobIDAsync(int jobID) => await PayoutDAO.Instance.GetPayoutByJobIDAsync(jobID);

        public async Task UpdatePayoutAsync(Payout Payout) => await PayoutDAO.Instance.UpdatePayoutAsync(Payout);

        public async Task<int> CountPayoutByHKAsync(int hkID) => await PayoutDAO.Instance.CountPayoutByHKAsync(hkID);
    }
}