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

        public async Task<List<Withdraw>> GetAllWithdrawsAsync() => await _repository.GetAllWithdrawsAsync();

        public async Task<List<Withdraw>> GetPendingWithdrawsAsync() => await _repository.GetPendingWithdrawsAsync();

        public async Task<int> GetTotalWithdrawAsync() => await _repository.GetTotalWithdrawAsync();

        public async Task<Withdraw> GetWithdrawByIDAsync(int id) => await _repository.GetWithdrawByIDAsync(id);

        public async Task<List<Withdraw>> GetWithdrawsByUserAsync(int uId) => await _repository.GetWithdrawsByUserAsync(uId);

        public async Task<List<Withdraw>> GetWithdrawsPastWeekAsync() => await _repository.GetWithdrawsPastWeekAsync();

        public async Task UpdateWithdrawAsync(Withdraw wi) => await _repository.UpdateWithdrawAsync(wi);
    }
}