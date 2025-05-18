﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Mapping;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using BusinessObject.Models.JWTToken;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DataAccess
{
    public class AccountDAO
    {
        private readonly IMapper _mapper;
        private readonly JwtConfig _jwtConfig;
        private static AccountDAO instance;
        private readonly IPasswordHasher<Account> _passwordHasher;
        private static readonly object instancelock = new object();

        private AccountDAO(IMapper mapper, JwtConfig jwtConfig, IPasswordHasher<Account> passwordHasher)
        {
            _mapper = mapper;
            _jwtConfig = jwtConfig;
            _passwordHasher = passwordHasher;
        }

        public static AccountDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        var mapper = GetMapper();

                        var jwtConfig = GetJwtConfig();
                        var passwordHasher = new PasswordHasher<Account>();

                        instance = new AccountDAO(mapper, jwtConfig, passwordHasher);
                    }
                    return instance;
                }
            }
        }

        private static IMapper GetMapper()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingConfig>());
            return config.CreateMapper();
        }

        private static JwtConfig GetJwtConfig()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();

            var jwtConfig = configuration.GetSection("JwtConfig").Get<JwtConfig>();
            return jwtConfig;
        }

        public string GenerateToken(TokenModel model)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(UserClaimTypes.AccountID, model.AccountID.ToString()),
                new Claim(UserClaimTypes.Name, model.Name),
                new Claim(UserClaimTypes.Email, model.Email),
                new Claim(UserClaimTypes.RoleID, model.RoleID.ToString()),
            };
            var token = new JwtSecurityToken(
                issuer: _jwtConfig.Issuer,
                audience: _jwtConfig.Audience,
                claims: claims,
            expires: DateTime.Now.AddMinutes(60),
                signingCredentials: credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<TokenModel> LoginAsync(JWTLoginModel loginAccount)
        {
            var tokenizedData = new TokenModel();
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();

            if (loginAccount.Email == configuration["Email"] && loginAccount.Password == configuration["Password"])
            {
                var aAccount = new Account()
                {
                    Name = "admin",
                    Email = "admin@gmail.com",
                    RoleID = 4,
                    Role = new Role { RoleName = "Admin" }
                };
                tokenizedData = new TokenModel
                {
                    AccountID = 0, // Nếu là admin, có thể đặt ID mặc định
                    Name = aAccount.Name,
                    Email = aAccount.Email,
                    RoleID = aAccount.RoleID,
                    RoleName = aAccount.Role?.RoleName ?? "Unknown"
                };
            }
            else
            {
                using (var db = new PCHWFDBContext())
                {
                    var account = await db.Account
                        .Include(x => x.Role) // Load Role từ DB
                        .FirstOrDefaultAsync(x => x.Email == loginAccount.Email);

                    if (account == null)
                    {
                        throw new KeyNotFoundException("Account with this Email or Password not found");
                    }

                    var checkPassword = _passwordHasher.VerifyHashedPassword(account, account.Password, loginAccount.Password);

                    if (checkPassword == PasswordVerificationResult.Success)
                    {
                        tokenizedData = new TokenModel
                        {
                            AccountID = account.AccountID,
                            Name = account.Name,
                            Email = account.Email,
                            RoleID = account.RoleID,
                            RoleName = account.Role?.RoleName ?? "Unknown" // Kiểm tra null
                        };
                    }
                    else
                    {
                        throw new Exception("Password is incorrect!");
                    }
                }
            }
            return tokenizedData;
        }

        public async Task<LoginInfoDTO> Login(JWTLoginModel model)
        {
            var tokenModel = await LoginAsync(model);
            var token = GenerateToken(tokenModel);

            return new LoginInfoDTO
            {
                AccountID = tokenModel.AccountID,
                Name = tokenModel.Name,
                RoleID = tokenModel.RoleID,
                RoleName = tokenModel.RoleName,
                Token = token
            };
        }

        public async Task<List<Account>> GetAllAccountsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Account>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Account.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }
        
        public async Task<List<Account>> GetAllStaffsAsync()
        {
            var list = new List<Account>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Account.Where(a => a.RoleID==3).AsNoTracking().ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<List<Account>> GetAllAccountsAsync()
        {
            var list = new List<Account>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Account.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<List<Account>> SearchAccountsByNameAsync(string name)
        {
            var list = new List<Account>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Account.Where(u => u.Name.Contains(name)).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Account> GetAccountByIDAsync(int uID)
        {
            Account Account;
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    Account = await context.Account.SingleOrDefaultAsync(x => x.AccountID == uID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return Account;
        }

        public async Task AddAccountAsync(Account Account)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Account.Add(Account);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeleteAccountAsync(int id)
        {
            var Account = await GetAccountByIDAsync(id);
            if (Account != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Account.Remove(Account);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdateAccountAsync(Account updatedAccount)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(updatedAccount).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AdminUpdateAccountAsync(Account updatedAccount)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(updatedAccount).State = EntityState.Modified;

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Account.AnyAsync(u => u.Email.Equals(email));
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<string> ValidateAccountAsync(AccountRegisterDTO AccountRegisterDTO)
        {
            if (string.IsNullOrWhiteSpace(AccountRegisterDTO.Name))
            {
                return "Full Name is required.";
            }

            if (string.IsNullOrWhiteSpace(AccountRegisterDTO.Email) || !IsValidEmail(AccountRegisterDTO.Email))
            {
                return "A valid Email is required.";
            }

            if (string.IsNullOrWhiteSpace(AccountRegisterDTO.Phone) || !Regex.IsMatch(AccountRegisterDTO.Phone, @"^\d{10}$"))
            {
                return "Phone Number must be exactly 10 digits.";
            }

            if (string.IsNullOrWhiteSpace(AccountRegisterDTO.Password))
            {
                return "Password is required.";
            }

            return null;
        }

        public async Task<string> ValidateUpdateAccountAsync(AccountUpdateDTO AccountUpdateDTO)
        {
            if (string.IsNullOrWhiteSpace(AccountUpdateDTO.Name))
            {
                return "Full Name is required.";
            }

            if (AccountUpdateDTO.Phone <= 0 || !IsValidPhoneNumber(AccountUpdateDTO.Phone))
            {
                return "Phone Number must be exactly 10 digits.";
            }

            return null;
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public bool IsValidPhoneNumber(int phoneNumber)
        {
            var phoneStr = phoneNumber.ToString();
            return phoneStr.Length == 9 && phoneStr.All(char.IsDigit);
        }

        public async Task ChangeAccountStatusAsync(int AccountId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var Account = await context.Account.SingleOrDefaultAsync(u => u.AccountID == AccountId);
                    if (Account != null)
                    {
                        Account.Status = Account.Status == 1 ? 0 : 1;
                        await context.SaveChangesAsync();
                    }
                    else
                    {
                        throw new KeyNotFoundException("Account not found.");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoginInfoDTO> LoginWithGoogleAsync(string googleToken, int roleID)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new List<string> { "681033702940-2pmjs4mfjeqjdd2k16qlo9fdl76ul3mg.apps.googleusercontent.com" }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(googleToken, settings);

            using (var db = new PCHWFDBContext())
            {
                var account = await db.Account.Include(a => a.Role).FirstOrDefaultAsync(a => a.Email == payload.Email);
                bool isNewAccount = false;
                if (account == null)
                {   //new accout
                    account = new Account
                    {
                        Name = payload.Name,
                        Email = payload.Email,
                        GoogleId = payload.Subject,
                        Provider = "Google",
                        GoogleProfilePicture = payload.Picture,
                        RoleID = roleID,
                        Status = (int)AccountStatus.Active,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now
                    };

                    db.Account.Add(account);
                    await db.SaveChangesAsync();

                    account = await db.Account.Include(a => a.Role).FirstOrDefaultAsync(a => a.Email == payload.Email);
                    var wallet = new Wallet
                    {
                        AccountID = account.AccountID,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        Status = 1
                    };
                    db.Wallet.Add(wallet);
                    await db.SaveChangesAsync();
                    isNewAccount = true;
                }
                else if (account.RoleID != roleID)
                {
                    throw new Exception("This account is already registered with another role.");
                }
                if (isNewAccount)
                {
                    if (roleID == 1) // Housekeeper
                    {
                        var housekeeper = new Housekeeper
                        {
                            AccountID = account.AccountID,
                            VerifyID = null
                        };
                        db.Housekeeper.Add(housekeeper);
                        await db.SaveChangesAsync();
                    }
                    else if (roleID == 2) // Family
                    {
                        var family = new Family
                        {
                            AccountID = account.AccountID
                        };
                        db.Family.Add(family);
                        await db.SaveChangesAsync();
                    }
                }
                var tokenModel = new TokenModel
                {
                    AccountID = account.AccountID,
                    Name = account.Name,
                    Email = account.Email,
                    RoleID = account.RoleID,
                    RoleName = account.Role?.RoleName ?? "Unknown"
                };
                var token = GenerateToken(tokenModel);

                return new LoginInfoDTO
                {
                    AccountID = tokenModel.AccountID,
                    Name = tokenModel.Name,
                    RoleID = tokenModel.RoleID,
                    RoleName = tokenModel.RoleName,
                    Token = token
                };
            }
        }

        public async Task<(int TotalHousekeepers, int TotalFamilies)> GetTotalAccountAsync()
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    int totalHousekeepers = await context.Account.CountAsync(a => a.RoleID == 1);
                    int totalFamilies = await context.Account.CountAsync(a => a.RoleID == 2);

                    return (totalHousekeepers, totalFamilies);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Account>> GetNewAccout()
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    DateTime sevenDaysAgo = DateTime.Now.AddDays(-7);
                    var list = await context.Account
                        .Where(a => (a.Role.RoleName == "Housekeeper" || a.Role.RoleName == "Family")
                                    && a.CreatedAt >= sevenDaysAgo)
                        .ToListAsync();
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int?> GetRoleIDByAccountIDAsync(int accountID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Account.Where(a => a.AccountID == accountID).Select(a => (int?)a.RoleID).FirstOrDefaultAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        //resetpassword
        public async Task<Account> GetAccountByEmailAsync(string email)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Account.FirstOrDefaultAsync(a => a.Email == email);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task SavePasswordResetTokenAsync(int accountId, string token, DateTime expiry)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var account = await context.Account.FindAsync(accountId);
                    if (account != null)
                    {
                        account.PasswordResetToken = token;
                        account.ResetTokenExpiry = expiry;
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Account> GetAccountByResetTokenAsync(string token)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Account.FirstOrDefaultAsync(a => a.PasswordResetToken == token && a.ResetTokenExpiry > DateTime.Now);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdatePasswordAsync(int accountId, string hashedPassword)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var account = await context.Account.FindAsync(accountId);
                    if (account != null)
                    {
                        account.Password = hashedPassword;
                        account.PasswordResetToken = null;
                        account.ResetTokenExpiry = null;
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task InvalidateResetTokenAsync(int accountId)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    var account = await context.Account.FindAsync(accountId);
                    if (account != null)
                    {
                        account.PasswordResetToken = null;
                        account.ResetTokenExpiry = null;
                        await context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}