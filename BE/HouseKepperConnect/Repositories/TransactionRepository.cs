using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        public async Task AddTransactionAsync(Transaction trans) => await TransactionDAO.Instance.AddTransactionAsync(trans);

        public async Task DeleteTransactionAsync(int id) => await TransactionDAO.Instance.DeleteTransactionAsync(id);

        public async Task<List<Transaction>> GetAllTransactionsAsync() => await TransactionDAO.Instance.GetAllTransactionsAsync();

        public async Task<int> GetTotalTransAsync() => await TransactionDAO.Instance.GetTotalTransAsync();

        public async Task<Transaction> GetTransactionByIDAsync(int id) => await TransactionDAO.Instance.GetTransactionByIDAsync(id);

        public async Task<List<Transaction>> GetTransactionsByUserAsync(int uId) => await TransactionDAO.Instance.GetTransactionsByUserAsync(uId);

        public async Task<List<Transaction>> GetTransactionsPastWeekAsync() => await TransactionDAO.Instance.GetTransactionsPastWeekAsync();

        public async Task UpdateTransactionAsync(Transaction Transaction) => await TransactionDAO.Instance.UpdateTransactionAsync(Transaction);
    }
}