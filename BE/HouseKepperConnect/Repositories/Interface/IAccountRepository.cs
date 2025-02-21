using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.JWTToken;

namespace Repositories.Interface
{
    public interface IAccountRepository
    {
        Task<string> Login(JWTLoginModel model);

        Task<List<Account>> GetAllAccountsAsync();

        Task<List<Account>> SearchAccountsByNameAsync(string name);

        Task<Account> GetAccountByIDAsync(int uID);

        Task AddAccountAsync(Account Account);

        Task DeleteAccountAsync(int id);

        Task UpdateAccountAsync(Account Account);

        Task<bool> IsEmailExistsAsync(string email);

        Task ChangeAccountStatusAsync(int AccountId);

        Task<string> ValidateAccountAsync(AccountRegisterDTO AccountRegisterDTO);

        Task<string> ValidateUpdateAccountAsync(AccountUpdateDTO AccountUpdateDTO);
    }
}