using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.JWTToken;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class AccountRepository : IAccountRepository
    {
        public async Task<LoginInfoDTO> Login(JWTLoginModel model) => await AccountDAO.Instance.Login(model);

        public async Task<List<Account>> GetAllAccountsAsync() => await AccountDAO.Instance.GetAllAccountsAsync();

        public async Task<List<Account>> SearchAccountsByNameAsync(string name) => await AccountDAO.Instance.SearchAccountsByNameAsync(name);

        public async Task<Account> GetAccountByIDAsync(int uID) => await AccountDAO.Instance.GetAccountByIDAsync(uID);

        public async Task AddAccountAsync(Account Account) => await AccountDAO.Instance.AddAccountAsync(Account);

        public async Task DeleteAccountAsync(int id) => await AccountDAO.Instance.DeleteAccountAsync(id);

        public async Task UpdateAccountAsync(Account Account) => await AccountDAO.Instance.UpdateAccountAsync(Account);

        public async Task<bool> IsEmailExistsAsync(string email) => await AccountDAO.Instance.IsEmailExistsAsync(email);

        public async Task ChangeAccountStatusAsync(int AccountId) => await AccountDAO.Instance.ChangeAccountStatusAsync(AccountId);

        public async Task<string> ValidateAccountAsync(AccountRegisterDTO AccountRegisterDTO) => await AccountDAO.Instance.ValidateAccountAsync(AccountRegisterDTO);

        public async Task<string> ValidateUpdateAccountAsync(AccountUpdateDTO AccountUpdateDTO) => await AccountDAO.Instance.ValidateUpdateAccountAsync(AccountUpdateDTO);

        public async Task<TokenModel> LoginWithGoogleAsync(string googleToken) => await AccountDAO.Instance.LoginWithGoogleAsync(googleToken);

        public async Task AdminUpdateAccountAsync(Account updatedAccount) => await AccountDAO.Instance.AdminUpdateAccountAsync(updatedAccount);

        public async Task<(int TotalHousekeepers, int TotalFamilies)> GetTotalAccountAsync() => await AccountDAO.Instance.GetTotalAccountAsync();

        public async Task<List<Account>> GetNewAccout() => await AccountDAO.Instance.GetNewAccout();
    }
}