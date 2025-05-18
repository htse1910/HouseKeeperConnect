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

        public async Task<List<Account>> GetAllAccountsAsync(int pageNumber, int pageSize) => await AccountDAO.Instance.GetAllAccountsAsync(pageNumber, pageSize);

        public async Task<List<Account>> SearchAccountsByNameAsync(string name) => await AccountDAO.Instance.SearchAccountsByNameAsync(name);

        public async Task<Account> GetAccountByIDAsync(int uID) => await AccountDAO.Instance.GetAccountByIDAsync(uID);

        public async Task AddAccountAsync(Account Account) => await AccountDAO.Instance.AddAccountAsync(Account);

        public async Task DeleteAccountAsync(int id) => await AccountDAO.Instance.DeleteAccountAsync(id);

        public async Task UpdateAccountAsync(Account Account) => await AccountDAO.Instance.UpdateAccountAsync(Account);

        public async Task<bool> IsEmailExistsAsync(string email) => await AccountDAO.Instance.IsEmailExistsAsync(email);

        public async Task ChangeAccountStatusAsync(int AccountId) => await AccountDAO.Instance.ChangeAccountStatusAsync(AccountId);

        public async Task<string> ValidateAccountAsync(AccountRegisterDTO AccountRegisterDTO) => await AccountDAO.Instance.ValidateAccountAsync(AccountRegisterDTO);

        public async Task<string> ValidateUpdateAccountAsync(AccountUpdateDTO AccountUpdateDTO) => await AccountDAO.Instance.ValidateUpdateAccountAsync(AccountUpdateDTO);

        public async Task<LoginInfoDTO> LoginWithGoogleAsync(string googleToken, int roleID) => await AccountDAO.Instance.LoginWithGoogleAsync(googleToken, roleID);

        public async Task AdminUpdateAccountAsync(Account updatedAccount) => await AccountDAO.Instance.AdminUpdateAccountAsync(updatedAccount);

        public async Task<(int TotalHousekeepers, int TotalFamilies)> GetTotalAccountAsync() => await AccountDAO.Instance.GetTotalAccountAsync();

        public async Task<List<Account>> GetNewAccout() => await AccountDAO.Instance.GetNewAccout();

        public async Task<int?> GetRoleIDByAccountIDAsync(int accountID) => await AccountDAO.Instance.GetRoleIDByAccountIDAsync((int)accountID);

        public async Task<Account> GetAccountByEmailAsync(string email) => await AccountDAO.Instance.GetAccountByEmailAsync(email);

        public async Task SavePasswordResetTokenAsync(int accountId, string token, DateTime expiry) => await AccountDAO.Instance.SavePasswordResetTokenAsync(accountId, token, expiry);

        public async Task<Account> GetAccountByResetTokenAsync(string token) => await AccountDAO.Instance.GetAccountByResetTokenAsync(token);

        public async Task UpdatePasswordAsync(int accountId, string hashedPassword) => await AccountDAO.Instance.UpdatePasswordAsync(accountId, hashedPassword);

        public async Task InvalidateResetTokenAsync(int accountId) => await AccountDAO.Instance.InvalidateResetTokenAsync(accountId);

        public async Task<List<Account>> GetAllAccountsAsync() => await AccountDAO.Instance.GetAllAccountsAsync();

        public async Task<List<Account>> GetAllStaffsAsync() => await AccountDAO.Instance.GetAllStaffsAsync();
    }
}