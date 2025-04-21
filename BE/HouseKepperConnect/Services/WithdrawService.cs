using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class WithdrawService : IWithdrawService
    {
        private readonly IWithdrawRepository _repository;

        public WithdrawService(IWithdrawRepository repository)
        {
            _repository = repository;
        }

        public async Task AddWithdrawAsync(Withdraw wi) => await _repository.AddWithdrawAsync(wi);

        public async Task DeleteWithdrawAsync(int id) => await _repository.DeleteWithdrawAsync(id);

        public async Task<List<Withdraw>> GetAllWithdrawsAsync(int pageNumber, int pageSize) => await _repository.GetAllWithdrawsAsync(pageNumber, pageSize);

        public async Task<List<Withdraw>> GetPendingWithdrawsAsync(int pageNumber, int pageSize) => await _repository.GetPendingWithdrawsAsync(pageNumber, pageSize);

        public async Task<int> GetTotalWithdrawAsync() => await _repository.GetTotalWithdrawAsync();

        public async Task<Withdraw> GetWithdrawByIDAsync(int id) => await _repository.GetWithdrawByIDAsync(id);

        public async Task<List<Withdraw>> GetWithdrawsByUserAsync(int uId, int pageNumber, int pageSize) => await _repository.GetWithdrawsByUserAsync(uId, pageNumber, pageSize);

        public async Task<List<Withdraw>> GetWithdrawsPastWeekAsync(int pageNumber, int pageSize) => await _repository.GetWithdrawsPastWeekAsync(pageNumber, pageSize);

        public async Task UpdateWithdrawAsync(Withdraw wi) => await _repository.UpdateWithdrawAsync(wi);

        public async Task<bool> VerifyOTPAsync(int withdrawId, string otpCode) => await _repository.VerifyOTPAsync(withdrawId, otpCode);
    }
}