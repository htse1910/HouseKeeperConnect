using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        public async Task AddTransactionAsync(Transaction trans) => await TransactionDAO.Instance.AddTransactionAsync(trans);

        public async Task DeleteTransactionAsync(int id) => await TransactionDAO.Instance.DeleteTransactionAsync(id);

        public async Task<List<Transaction>> GetAllTransactionsAsync(int pageNumber, int pageSize) => await TransactionDAO.Instance.GetAllTransactionsAsync(pageNumber, pageSize);

        public async Task<int> GetTotalTransAsync() => await TransactionDAO.Instance.GetTotalTransAsync();

        public async Task<Transaction> GetTransactionByIDAsync(int id) => await TransactionDAO.Instance.GetTransactionByIDAsync(id);

        public async Task<List<Transaction>> GetTransactionsByUserAsync(int uId, int pageNumber, int pageSize) => await TransactionDAO.Instance.GetTransactionsByUserAsync(uId, pageNumber, pageSize);

        public async Task<List<Transaction>> GetTransactionsPastWeekAsync(int pageNumber, int pageSize) => await TransactionDAO.Instance.GetTransactionsPastWeekAsync(pageNumber, pageSize);

        public async Task UpdateTransactionAsync(Transaction Transaction) => await TransactionDAO.Instance.UpdateTransactionAsync(Transaction);
    }
}