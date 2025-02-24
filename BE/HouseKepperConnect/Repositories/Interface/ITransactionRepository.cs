using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface ITransactionRepository
    {
        Task<List<Transaction>> GetAllTransactionsAsync();

        Task<Transaction> GetTransactionByIDAsync(int id);

        Task<Transaction> GetTransactionByUserAsync(int uId);

        Task AddTransactionAsync(Transaction Transaction);

        Task DeleteTransactionAsync(int id);

        Task UpdateTransactionAsync(Transaction Transaction);
    }
}