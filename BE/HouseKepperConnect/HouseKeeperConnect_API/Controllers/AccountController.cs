using Appwrite;
using Appwrite.Models;
using Appwrite.Services;
using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.AppWrite;
using BusinessObject.Models.Enum;
using BusinessObject.Models.JWTToken;
using HouseKeeperConnect_API.CustomServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
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
        private readonly IPasswordHasher<BusinessObject.Models.Account> _passwordHasher;
        private readonly IWalletService _walletService;
        private readonly IFamilyProfileService _familyProfileService;
        private readonly IHouseKeeperService _houseKeeperService;
        private readonly IConfiguration _configuration;
        private readonly Client _appWriteClient;
        private readonly EmailHelper _emailHelper;

        private static readonly char[] Characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();

        private static string GenerateaccountCode(int length = 20)
        {
            var random = new Random();
            return new string(Enumerable.Range(0, length)
                .Select(_ => Characters[random.Next(Characters.Length)]).ToArray());
        }

        public AccountController(IAccountService accountService, IMapper mapper, IPasswordHasher<BusinessObject.Models.Account> passwordHasher, IWalletService walletService, IFamilyProfileService familyProfileService, IHouseKeeperService houseKeeperService, IConfiguration configuration, EmailHelper emailHelper)
        {
            _accountService = accountService;
            _mapper = mapper;
            _passwordHasher = passwordHasher;
            _walletService = walletService;
            _familyProfileService = familyProfileService;
            _houseKeeperService = houseKeeperService;
            _configuration = configuration;
            AppwriteSettings appW = new AppwriteSettings()
            {
                ProjectId = configuration.GetValue<string>("Appwrite:ProjectId"),
                Endpoint = configuration.GetValue<string>("Appwrite:Endpoint"),
                ApiKey = configuration.GetValue<string>("Appwrite:ApiKey")
            };
            _appWriteClient = new Client().SetProject(appW.ProjectId).SetEndpoint(appW.Endpoint).SetKey(appW.ApiKey);
            _emailHelper = emailHelper;
        }

        // GET: api/<AccountController>
        [HttpGet("AccountList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<AccountDisplayDTO>>> GetAllaccount(int pageNumber, int pageSize)
        {
            try
            {
                var accountList = await _accountService.GetAllAccountsAsync(pageNumber, pageSize);
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
        public async Task<ActionResult<AccountRegisterDTO>> Register([FromForm] AccountRegisterDTO accountRegisterDTO)
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

            var storage = new Storage(_appWriteClient);
            var buckID = "67e3d029000d5b9dd68e";
            var projectID = _configuration.GetValue<string>("Appwrite:ProjectId");
            List<string> perms = new List<string>() { Permission.Write(Appwrite.Role.Any()), Permission.Read(Appwrite.Role.Any()) };

            var id = Guid.NewGuid().ToString();
            var avatar = InputFile.FromStream(
        accountRegisterDTO.LocalProfilePicture.OpenReadStream(),
        accountRegisterDTO.LocalProfilePicture.FileName,
        accountRegisterDTO.LocalProfilePicture.ContentType
        );
            var response = await storage.CreateFile(
                buckID,
                id,
                avatar,
                perms,
                null
                );
            var avatarID = response.Id;
            var avatarUrl = $"{_appWriteClient.Endpoint}/storage/buckets/{response.BucketId}/files/{avatarID}/view?project={projectID}";

            var acc = _mapper.Map<BusinessObject.Models.Account>(accountRegisterDTO);

            acc.Status = (int)AccountStatus.Active;
            acc.CreatedAt = DateTime.Now;
            acc.UpdatedAt = DateTime.Now;
            acc.Password = _passwordHasher.HashPassword(acc, accountRegisterDTO.Password);
            acc.Introduction = accountRegisterDTO.Introduction;
            acc.LocalProfilePicture = avatarUrl;
            acc.Gender = (int)accountRegisterDTO.Gender;
            await _accountService.AddAccountAsync(acc);
            if (acc.RoleID == 1)
            {
                var housekeeper = new Housekeeper
                {
                    AccountID = acc.AccountID,
                    VerifyID = null,
                };
                await _houseKeeperService.AddHousekeeperAsync(housekeeper);
            }
            else if (acc.RoleID == 2)
            {
                var family = new Family
                {
                    AccountID = acc.AccountID,
                };
                await _familyProfileService.AddFamilyAsync(family);
            }

            var wallet = new Wallet
            {
                AccountID = acc.AccountID,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Status = 1
            };
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

            var account = _mapper.Map<BusinessObject.Models.Account>(accountUpdateDTO);
            var u = await _accountService.GetAccountByIDAsync(account.AccountID);
            if (u == null)
            {
                return NotFound("No Account Found!");
            }

/*            if (!string.IsNullOrEmpty(accountUpdateDTO.Password))
            {
                account.Password = _passwordHasher.HashPassword(account, accountUpdateDTO.Password);
            }*/
            else
            {
                account.Password = u.Password;
            }

            await _accountService.UpdateAccountAsync(account);
            return Ok("Account Updated!");
        }

        [HttpPut("AdminUpdateAccount")]
        [Authorize]
        public async Task<IActionResult> AdminUpdate(AdminUpdateAccountDTO adminUpdateDTO)
        {
            var account = _mapper.Map<BusinessObject.Models.Account>(adminUpdateDTO);
            var u = await _accountService.GetAccountByIDAsync(account.AccountID);
            if (u == null)
            {
                return NotFound("No Account Found!");
            }

            if (!string.IsNullOrEmpty(adminUpdateDTO.Password))
            {
                account.Password = _passwordHasher.HashPassword(account, adminUpdateDTO.Password);
            }
            else
            {
                account.Password = u.Password;
            }

            await _accountService.UpdateAccountAsync(account);
            return Ok("Account Updated!");
        }

        [HttpPut("ChangeStatus")]
        [Authorize]
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

            var loginInfo = await _accountService.LoginWithGoogleAsync(googleLoginDTO.GoogleToken, googleLoginDTO.RoleID);
            if (loginInfo == null)
            {
                return Unauthorized("Invalid Google Token.");
            }
            var existingAccount = await _accountService.GetAccountByEmailAsync(loginInfo.Email);
            if (existingAccount != null && existingAccount.RoleID != googleLoginDTO.RoleID)
            {
                return BadRequest("This account is already registered with another role.");
            }

            if (existingAccount == null)
            {
                if (googleLoginDTO.RoleID == 1) 
                {
                    var housekeeper = new Housekeeper
                    {
                        AccountID = loginInfo.AccountID,
                        VerifyID = null, 
                    };
                    await _houseKeeperService.AddHousekeeperAsync(housekeeper);
                }
                else if (googleLoginDTO.RoleID == 2) 
                {
                    var family = new Family
                    {
                        AccountID = loginInfo.AccountID,
                    };
                    await _familyProfileService.AddFamilyAsync(family);
                }
            }
            return Ok(loginInfo);
        }

        [HttpGet("TotalAccount")]
        [Authorize]
        public async Task<IActionResult> GetTotalAccount()
        {
            var (totalHousekeepers, totalFamilies) = await _accountService.GetTotalAccountAsync();
            var result = new TotalAccountDTO
            {
                TotalHousekeepers = totalHousekeepers,
                TotalFamilies = totalFamilies
            };
            return Ok(result);
        }

        [HttpGet("NewAccounts")]
        [Authorize]
        public async Task<IActionResult> GetNewAccount()
        {
            var accounts = await _accountService.GetNewAccout();
            var accountDTOs = _mapper.Map<List<AccountDisplayDTO>>(accounts);
            return Ok(accountDTOs);
        }

        [HttpPost("Request-forgot-password")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] string email)
        {
            
            var account = await _accountService.GetAccountByEmailAsync(email);
            if (account == null) return NotFound("Email không tồn tại.");
            string token = Guid.NewGuid().ToString();
            DateTime expiry = DateTime.Now.AddHours(1);
            await _accountService.SavePasswordResetTokenAsync(account.AccountID, token, expiry);
            string resetLink = $"http://localhost:5173/reset-password?token={token}";
            string subject = "Password Reset Request";
            string body = $"Click <a href='{resetLink}'>here</a> to reset your password.";
            await _emailHelper.SendEmailAsync(email, subject, body);
            return Ok("Email đặt lại mật khẩu đã được gửi.");
        }

        [HttpPost("Reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            if (resetPasswordDTO.NewPassword != resetPasswordDTO.ConfirmPassword)
            {
                return BadRequest("Mật khẩu xác nhận không khớp.");
            }

            var account = await _accountService.GetAccountByResetTokenAsync(resetPasswordDTO.Token);
            if (account == null)
            {
                return BadRequest("Token không hợp lệ hoặc đã hết hạn.");
            }

            var passwordHasher = new PasswordHasher<BusinessObject.Models.Account>();
            string hashedPassword = passwordHasher.HashPassword(account, resetPasswordDTO.NewPassword);
            await _accountService.UpdatePasswordAsync(account.AccountID, hashedPassword);
            await _accountService.InvalidateResetTokenAsync(account.AccountID);

            return Ok("Mật khẩu đã được đặt lại thành công.");
        }
    }
}