using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class PayoutService : IPayoutService
    {
        private readonly IPayoutRepository _payoutRepository;

        public PayoutService(IPayoutRepository payoutRepository)
        {
            _payoutRepository = payoutRepository;
        }

        public async Task AddPayoutAsync(Payout Payout) => await _payoutRepository.AddPayoutAsync(Payout);

        public async Task DeletePayoutAsync(int id) => await _payoutRepository.DeletePayoutAsync(id);

        public async Task<List<Payout>> GetAllPayoutsAsync(int pageNumber, int pageSize) => await _payoutRepository.GetAllPayoutsAsync(pageNumber, pageSize);

        public async Task<Payout> GetPayoutByIDAsync(int rID) => await _payoutRepository.GetPayoutByIDAsync(rID);

        public async Task<List<Payout>> GetPayoutsByHKAsync(int hkID, int pageNumber, int pageSize) => await _payoutRepository.GetPayoutsByHKAsync(hkID, pageNumber, pageSize);

        public async Task<Payout> GetPayoutByJobIDAsync(int jobID) => await _payoutRepository.GetPayoutByJobIDAsync(jobID);

        public async Task UpdatePayoutAsync(Payout Payout) => await _payoutRepository.UpdatePayoutAsync(Payout);
    }
}