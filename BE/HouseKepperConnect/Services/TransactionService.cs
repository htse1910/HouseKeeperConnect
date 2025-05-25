using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;

        public TransactionService(ITransactionRepository transactionRepository)
        {
            _transactionRepository = transactionRepository;
        }

        public async Task AddTransactionAsync(Transaction Transaction) => await _transactionRepository.AddTransactionAsync(Transaction);

        public async Task DeleteTransactionAsync(int id) => await _transactionRepository.DeleteTransactionAsync(id);

        public async Task<List<Transaction>> GetAllTransactionsAsync(int pageNumber, int pageSize) => await _transactionRepository.GetAllTransactionsAsync(pageNumber, pageSize);

        public async Task<List<Transaction>> GetAllTransactionsAsync() => await _transactionRepository.GetAllTransactionsAsync();

        public async Task<int> GetTotalTransAsync() => await _transactionRepository.GetTotalTransAsync();

        public async Task<Transaction> GetTransactionByIDAsync(int id) => await _transactionRepository.GetTransactionByIDAsync(id);

        public async Task<List<Transaction>> GetTransactionsByUserAsync(int uId, int pageNumber, int pageSize) => await _transactionRepository.GetTransactionsByUserAsync(uId, pageNumber, pageSize);

        public async Task<List<Transaction>> GetTransactionsPastWeekAsync(int pageNumber, int pageSize) => await _transactionRepository.GetTransactionsPastWeekAsync(pageNumber, pageSize);

        public async Task UpdateTransactionAsync(Transaction Transaction) => await _transactionRepository.UpdateTransactionAsync(Transaction);
    }
}