using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetAllTransactionsAsync(int pageNumber, int pageSize);

        Task<List<Transaction>> GetTransactionsPastWeekAsync(int pageNumber, int pageSize);

        Task<int> GetTotalTransAsync();

        Task<Transaction> GetTransactionByIDAsync(int id);

        Task<List<Transaction>> GetTransactionsByUserAsync(int uId, int pageNumber, int pageSize);

        Task AddTransactionAsync(Transaction Transaction);

        Task DeleteTransactionAsync(int id);

        Task UpdateTransactionAsync(Transaction Transaction);
    }
}