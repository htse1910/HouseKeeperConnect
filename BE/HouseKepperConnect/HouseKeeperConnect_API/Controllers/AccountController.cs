using AutoMapper;
using BusinessObject.DTO;

using BusinessObject.Models;
using BusinessObject.Models.Enum;
using BusinessObject.Models.JWTToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        private readonly IMapper _mapper;
        private string Message;
        private readonly IPasswordHasher<Account> _passwordHasher;
        private readonly IWalletService _walletService;

        private static readonly char[] Characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();

        private static string GenerateaccountCode(int length = 20)
        {
            var random = new Random();
            return new string(Enumerable.Range(0, length)
                .Select(_ => Characters[random.Next(Characters.Length)]).ToArray());
        }

        public AccountController(IAccountService accountService, IMapper mapper, IPasswordHasher<Account> passwordHasher, IWalletService walletService)
        {
            _accountService = accountService;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
            _walletService = walletService;
        }

        // GET: api/<AccountController>
        [HttpGet("AccountList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<AccountDisplayDTO>>> GetAllaccount()
        {
            try
            {
                var accountList = await _accountService.GetAllAccountsAsync();
                if (accountList.Count == 0)
                {
                    return NotFound("Account list is empty!");
                }

                var list = _mapper.Map<List<AccountDisplayDTO>>(accountList);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("SearchAccount")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AccountDisplayDTO>>> SearchByName([FromQuery] string name)
        {
            var list = await _accountService.SearchAccountsByNameAsync(name);
            var nList = _mapper.Map<List<AccountDisplayDTO>>(list);

            if (nList.Count == 0)
            {
                Message = "No accounts found!";
                return NotFound(Message);
            }
            return Ok(nList);
        }

        // GET api/<AccountController>/5
        [HttpGet("GetAccount")]
        [Authorize]
        public async Task<ActionResult<AccountDisplayDTO>> GetaccountByID([FromQuery] int id)
        {
            var account = await _accountService.GetAccountByIDAsync(id);
            if (account == null)
            {
                return NotFound("account not found");
            }
            var accountDTO = _mapper.Map<AccountDisplayDTO>(account);
            return Ok(accountDTO);
        }

        [HttpGet("Login")]
        public async Task<ActionResult<LoginInfoDTO>> Login([FromQuery] string email, [FromQuery] string password)
        {
            try
            {
                var model = new JWTLoginModel()
                {
                    Email = email,
                    Password = password
                };

                var loginInfo = await _accountService.Login(model);
                return Ok(loginInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<AccountController>
        [HttpPost("Register")]
        public async Task<ActionResult<AccountRegisterDTO>> Register(AccountRegisterDTO accountRegisterDTO)
        {
            var validationResult = await _accountService.ValidateAccountAsync(accountRegisterDTO);
            if (validationResult != null)
            {
                return BadRequest(validationResult);
            }

            if (await _accountService.IsEmailExistsAsync(accountRegisterDTO.Email))
            {
                Message = "Email already exists!";
                return Conflict(Message);
            }
            if (accountRegisterDTO.RoleID != 1 && accountRegisterDTO.RoleID != 2)
            {
                return BadRequest("Invalid role selection!");
            }
            var account = _mapper.Map<Account>(accountRegisterDTO);
            account.Status = (int)AccountStatus.Active;
            account.CreatedAt = DateTime.Now;
            account.UpdatedAt = DateTime.Now;
            account.Password = _passwordHasher.HashPassword(account, accountRegisterDTO.Password);

            var wallet = new Wallet();
            wallet.AccountID = account.AccountID;
            wallet.CreatedAt = DateTime.Now;
            wallet.UpdatedAt = DateTime.Now;
            wallet.Status = 1;

            await _accountService.AddAccountAsync(account); // Lưu account trước
            wallet.AccountID = account.AccountID; // Lấy AccountID sau khi account đã được lưu
            await _walletService.AddWalletAsync(wallet);
            Message = "New Account Added!";
            return Ok(Message);
        }

        // PUT api/<AccountController>/5
        [HttpPut("UpdateAccount")]
        [Authorize]
        public async Task<IActionResult> Update(AccountUpdateDTO accountUpdateDTO)
        {
            var validationResult = await _accountService.ValidateUpdateAccountAsync(accountUpdateDTO);
            if (validationResult != null)
            {
                return BadRequest(validationResult);
            }
            if (await _accountService.IsEmailExistsAsync(accountUpdateDTO.Email))
            {
                Message = "Email already exists!";
                return Conflict(Message);
            }
            var account = _mapper.Map<Account>(accountUpdateDTO);
            var u = await _accountService.GetAccountByIDAsync(account.AccountID);
            if (u == null)
            {
                return NotFound("No Account Found!");
            }

            if (!string.IsNullOrEmpty(accountUpdateDTO.Password))
            {
                account.Password = _passwordHasher.HashPassword(account, accountUpdateDTO.Password);
            }
            else
            {
                account.Password = u.Password;
            }

            account.CreatedAt = u.CreatedAt;
            account.UpdatedAt = DateTime.Now;

            await _accountService.UpdateAccountAsync(account);
            return Ok("Account Updated!");
        }

        [HttpPut("ChangeStatus")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ToggleStatus([FromQuery] int id)
        {
            try
            {
                var account = await _accountService.GetAccountByIDAsync(id);
                if (account == null)
                {
                    return NotFound("Account not found!");
                }
                await _accountService.ChangeAccountStatusAsync(id);
                return Ok($"Account {account.Name.Trim()} status has been updated!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("LoginWithGoogle")]
        public async Task<IActionResult> LoginWithGoogle([FromQuery] GoogleLoginDTO googleLoginDTO)
        {
            if (string.IsNullOrEmpty(googleLoginDTO.GoogleToken))
            {
                return BadRequest("Google Token is required.");
            }

            var tokenModel = await _accountService.LoginWithGoogleAsync(googleLoginDTO.GoogleToken);
            if (tokenModel == null)
            {
                return Unauthorized("Invalid Google Token.");
            }

            return Ok(tokenModel);
        }
    }
}