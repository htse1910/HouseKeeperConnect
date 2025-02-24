using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class WalletRepository : IWalletRepository
    {
        public async Task AddWalletAsync(Wallet Wallet) => await WalletDAO.Instance.AddWalletAsync(Wallet);

        public async Task DeleteWalletAsync(int id) => await WalletDAO.Instance.DeleteWalletAsync(id);

        public async Task<List<Wallet>> GetAllWalletsAsync() => await WalletDAO.Instance.GetAllWalletsAsync();

        public async Task<Wallet> GetWalletByIDAsync(int uID) => await WalletDAO.Instance.GetWalletByIDAsync(uID);

        public async Task<Wallet> GetWalletByUserAsync(int id) => await WalletDAO.Instance.GetWalletByUserAsync(id);

        public async Task UpdateWalletAsync(Wallet Wallet) => await WalletDAO.Instance.UpdateWalletAsync(Wallet);
    }
}