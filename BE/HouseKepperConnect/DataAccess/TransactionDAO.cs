using AutoMapper;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class TransactionDAO
    {
        private readonly IMapper _mapper;
        private static TransactionDAO instance;
        private static readonly object instancelock = new object();

        public TransactionDAO()
        { }

        public static TransactionDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new TransactionDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Transaction>> GetAllTransactionsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Transaction>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Transaction.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }
        
        public async Task<List<Transaction>> GetAllTransactionsAsync()
        {
            var list = new List<Transaction>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Transaction.Where(a => a.Status==(int)TransactionStatus.Completed).AsNoTracking().ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Transaction> GetTransactionByIDAsync(int id)
        {
            Transaction transaction = new Transaction();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    transaction = await context.Transaction.SingleOrDefaultAsync(x => x.TransactionID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return transaction;
        }

        public async Task<List<Transaction>> GetTransactionsPastWeekAsync(int pageNumber, int pageSize)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var oneWeekAgo = DateTime.Now.AddDays(-7);
                    var transactions = await context.Transaction
                .Where(x => x.UpdatedDate >= oneWeekAgo && x.Status == (int)TransactionStatus.Completed).
                AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .ToListAsync();

                    return transactions;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> GetTotalTransAsync()
        {
            int totalTrans;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    totalTrans = await context.Transaction.CountAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return totalTrans;
        }

        public async Task<List<Transaction>> GetTransactionsByUserAsync(int uId, int pageNumber, int pageSize)
        {
            var trans = new List<Transaction>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.Transaction.Where(t => t.AccountID == uId && t.Status!=(int)TransactionStatus.Pending).
                        OrderByDescending(t => t.UpdatedDate).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }

        public async Task AddTransactionAsync(Transaction trans)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Transaction.Add(trans);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteTransactionAsync(int id)
        {
            var Transaction = await GetTransactionByIDAsync(id);
            if (Transaction != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Transaction.Remove(Transaction);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateTransactionAsync(Transaction trans)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(trans).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}