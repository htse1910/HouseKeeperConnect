using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.JWTToken;

namespace Repositories.Interface
{
    public interface IAccountRepository
    {
        Task<LoginInfoDTO> Login(JWTLoginModel model);

        Task<List<Account>> GetAllAccountsAsync(int pageNumber, int pageSize);

        Task<List<Account>> SearchAccountsByNameAsync(string name);

        Task<Account> GetAccountByIDAsync(int uID);

        Task AddAccountAsync(Account Account);

        Task DeleteAccountAsync(int id);

        Task UpdateAccountAsync(Account Account);

        Task<bool> IsEmailExistsAsync(string email);

        Task ChangeAccountStatusAsync(int AccountId);

        Task<string> ValidateAccountAsync(AccountRegisterDTO AccountRegisterDTO);

        Task<string> ValidateUpdateAccountAsync(AccountUpdateDTO AccountUpdateDTO);

        Task<TokenModel> LoginWithGoogleAsync(string googleToken);

        Task AdminUpdateAccountAsync(Account updatedAccount);

        Task<(int TotalHousekeepers, int TotalFamilies)> GetTotalAccountAsync();

        Task<List<Account>> GetNewAccout();

        Task<int?> GetRoleIDByAccountIDAsync(int accountID);

        Task<Account> GetAccountByEmailAsync(string email);

        Task SavePasswordResetTokenAsync(int accountId, string token, DateTime expiry);

        Task<Account> GetAccountByResetTokenAsync(string token);

        Task UpdatePasswordAsync(int accountId, string hashedPassword);
    }
}