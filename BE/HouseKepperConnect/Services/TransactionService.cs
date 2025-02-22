using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task<List<Transaction>> GetAllTransactionsAsync() => await _transactionRepository.GetAllTransactionsAsync();

        public async Task<Transaction> GetTransactionByIDAsync(int id) => await _transactionRepository.GetTransactionByIDAsync(id);

        public async Task<Transaction> GetTransactionByUserAsync(int uId) => await _transactionRepository.GetTransactionByUserAsync(uId);

        public async Task UpdateTransactionAsync(Transaction Transaction) => await _transactionRepository.UpdateTransactionAsync(Transaction);
    }
}
