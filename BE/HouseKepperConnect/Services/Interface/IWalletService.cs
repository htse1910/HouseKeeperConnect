using BusinessObject.Models;

namespace Services.Interface
{
    public interface IWalletService
    {
        Task<List<Wallet>> GetAllWalletsAsync();

        Task<Wallet> GetWalletByIDAsync(int uID);

        Task<Wallet> GetWalletByUserAsync(int id);

        Task AddWalletAsync(Wallet Wallet);

        Task DeleteWalletAsync(int id);

        Task UpdateWalletAsync(Wallet Wallet);
    }
}