using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.JWTToken;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;

        public AccountService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<LoginInfoDTO> Login(JWTLoginModel model) => await _accountRepository.Login(model);

        public async Task<List<Account>> GetAllAccountsAsync() => await _accountRepository.GetAllAccountsAsync();

        public async Task<List<Account>> SearchAccountsByNameAsync(string name) => await _accountRepository.SearchAccountsByNameAsync(name);

        public async Task<Account> GetAccountByIDAsync(int uID) => await _accountRepository.GetAccountByIDAsync(uID);

        public async Task AddAccountAsync(Account Account) => await _accountRepository.AddAccountAsync(Account);

        public async Task DeleteAccountAsync(int id) => await _accountRepository.DeleteAccountAsync(id);

        public async Task UpdateAccountAsync(Account Account) => await _accountRepository.UpdateAccountAsync(Account);

        public async Task<bool> IsEmailExistsAsync(string email) => await _accountRepository.IsEmailExistsAsync(email);

        public async Task ChangeAccountStatusAsync(int AccountId) => await _accountRepository.ChangeAccountStatusAsync(AccountId);

        public async Task<string> ValidateAccountAsync(AccountRegisterDTO AccountRegisterDTO) => await _accountRepository.ValidateAccountAsync(AccountRegisterDTO);

        public async Task<string> ValidateUpdateAccountAsync(AccountUpdateDTO AccountUpdateDTO) => await _accountRepository.ValidateUpdateAccountAsync(AccountUpdateDTO);

        public async Task<TokenModel> LoginWithGoogleAsync(string googleToken) => await _accountRepository.LoginWithGoogleAsync(googleToken);

        public async Task AdminUpdateAccountAsync(Account updatedAccount) => await _accountRepository.AdminUpdateAccountAsync(updatedAccount);
    }
}