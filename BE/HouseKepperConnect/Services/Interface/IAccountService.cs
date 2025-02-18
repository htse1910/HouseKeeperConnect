using BusinessObject.DTO;
using BusinessObject.Models.JWTToken;
using BusinessObject.Models;

namespace Services.Interface
{
    public interface IAccountService
    {
        Task<string> Login(JWTLoginModel model);
        Task<List<Account>> GetAllAccountsAsync();
        Task<List<Account>> SearchAccountsByNameAsync(string name);
        Task<Account> GetAccountByIDAsync(Guid uID);
        Task AddAccountAsync(Account Account);
        Task DeleteAccountAsync(Guid id);
        Task UpdateAccountAsync(Account Account);
        Task<bool> IsEmailExistsAsync(string email);
        Task ChangeAccountStatusAsync(Guid AccountId);
        Task<string> ValidateAccountAsync(AccountRegisterDTO AccountRegisterDTO);
        Task<string> ValidateUpdateAccountAsync(AccountUpdateDTO AccountUpdateDTO);
    }
}