using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class WalletService : IWalletService
    {
        private readonly IWalletRepository _walletRepository;

        public WalletService(IWalletRepository walletRepository)
        {
            _walletRepository = walletRepository;
        }

        public async Task AddWalletAsync(Wallet Wallet) => await _walletRepository.AddWalletAsync(Wallet);

        public async Task DeleteWalletAsync(int id) => await _walletRepository.DeleteWalletAsync(id);

        public async Task<List<Wallet>> GetAllWalletsAsync() => await _walletRepository.GetAllWalletsAsync();

        public async Task<Wallet> GetWalletByIDAsync(int uID) => await _walletRepository.GetWalletByIDAsync(uID);

        public async Task<Wallet> GetWalletByUserAsync(int id) => await _walletRepository.GetWalletByUserAsync(id);

        public async Task UpdateWalletAsync(Wallet Wallet) => await _walletRepository.UpdateWalletAsync(Wallet);
    }
}