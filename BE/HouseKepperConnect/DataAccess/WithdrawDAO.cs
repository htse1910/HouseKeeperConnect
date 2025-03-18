using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class WithdrawDAO
    {
        private static WithdrawDAO instance;
        private static readonly object instancelock = new object();

        public WithdrawDAO()
        { }

        public static WithdrawDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new WithdrawDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Withdraw>> GetAllWithdrawsAsync()
        {
            var list = new List<Withdraw>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Withdraw.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Withdraw> GetWithdrawByIDAsync(int id)
        {
            Withdraw Withdraw = new Withdraw();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Withdraw = await context.Withdraw.SingleOrDefaultAsync(x => x.WithdrawID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Withdraw;
        }

        public async Task<List<Withdraw>> GetWithdrawsPastWeekAsync()
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var oneWeekAgo = DateTime.UtcNow.AddDays(-7);
                    var Withdraws = await context.Withdraw
                .Where(x => x.RequestDate >= oneWeekAgo && x.Status == (int)TransactionStatus.Completed)
                .ToListAsync();

                    return Withdraws;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Withdraw>> GetPendingWithdrawsAsync()
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var oneWeekAgo = DateTime.UtcNow.AddDays(-7);
                    var Withdraws = await context.Withdraw
                .Where(x => x.Status == (int)TransactionStatus.Pending)
                .ToListAsync();

                    return Withdraws;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> GetTotalWithdrawAsync()
        {
            int totalTrans;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    totalTrans = await context.Withdraw.CountAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return totalTrans;
        }

        public async Task<List<Withdraw>> GetWithdrawsByUserAsync(int uId)
        {
            var trans = new List<Withdraw>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    trans = await context.Withdraw.Where(t => t.AccountID == uId).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return trans;
        }

        public async Task AddWithdrawAsync(Withdraw wi)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Withdraw.Add(wi);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteWithdrawAsync(int id)
        {
            var Withdraw = await GetWithdrawByIDAsync(id);
            if (Withdraw != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Withdraw.Remove(Withdraw);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateWithdrawAsync(Withdraw wi)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(wi).State = EntityState.Modified;
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