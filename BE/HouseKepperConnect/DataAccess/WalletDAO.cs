using AutoMapper;
using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class WalletDAO
    {
        private readonly IMapper _mapper;
        private static WalletDAO instance;
        private static readonly object instancelock = new object();

        public WalletDAO()
        {
        }

        public static WalletDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new WalletDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Wallet>> GetAllWalletsAsync()
        {
            var list = new List<Wallet>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Wallet.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Wallet> GetWalletByIDAsync(int uID)
        {
            Wallet wallet;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    wallet = await context.Wallet.SingleOrDefaultAsync(x => x.WalletID == uID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return wallet;
        }

        public async Task<Wallet> GetWalletByUserAsync(int id)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Wallet.SingleOrDefaultAsync(t => t.AccountID == id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddWalletAsync(Wallet Wallet)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Wallet.Add(Wallet);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteWalletAsync(int id)
        {
            var Wallet = await GetWalletByIDAsync(id);
            if (Wallet != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Wallet.Remove(Wallet);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateWalletAsync(Wallet Wallet)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(Wallet).State = EntityState.Modified;
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