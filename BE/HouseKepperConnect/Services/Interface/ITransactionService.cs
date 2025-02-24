using BusinessObject.Models;

namespace Services.Interface
{
    public interface ITransactionService
    {
        Task<List<Transaction>> GetAllTransactionsAsync();

        Task<Transaction> GetTransactionByIDAsync(int id);

        Task<List<Transaction>> GetTransactionsByUserAsync(int uId);

        Task AddTransactionAsync(Transaction Transaction);

        Task DeleteTransactionAsync(int id);

        Task UpdateTransactionAsync(Transaction Transaction);
    }
}