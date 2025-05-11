using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using BusinessObject.Models.PayOS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly IWalletService _walletService;
        private readonly IPaymentService _paymentService;
        private readonly IAccountService _accountService;
        private readonly ITransactionService _transactionService;
        private readonly IMapper _mapper;
        private string Message;

        public WalletController(IWalletService walletService, IPaymentService paymentService, IMapper mapper, IAccountService accountService, ITransactionService transactionService)
        {
            _walletService = walletService;
            _mapper = mapper;
            _paymentService = paymentService;
            _accountService = accountService;
            _transactionService = transactionService;
        }

        // GET: api/<WalletController>
        [HttpGet("WalletList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<List<Wallet>>> GetWalletsAsync()
        {
            var list = await _walletService.GetAllWalletsAsync();
            if (list == null)
            {
                Message = "Wallet list is empty!";
                return NotFound();
            }

            return Ok(list);
        }

        // GET api/<WalletController>/5
        [HttpGet("getWallet")]
        [Authorize]
        public async Task<ActionResult<Wallet>> GetWalletByID(int id)
        {
            var wallet = await _walletService.GetWalletByIDAsync(id);
            if (wallet == null)
            {
                Message = "No wallet found!";
                return NotFound(Message);
            }
            return Ok(wallet);
        }

        [HttpGet("GetWalletByAccountID")]
        [Authorize]
        public async Task<ActionResult<Wallet>> GetWalletByAccountID([FromQuery] int id)
        {
            var wallet = await _walletService.GetWalletByUserAsync(id);
            if (wallet == null)
            {
                Message = "No wallet found!";
                return NotFound(Message);
            }
            var display = _mapper.Map<Wallet>(wallet);
            return Ok(wallet);
        }

        // POST api/<WalletController>
        [HttpPost("AddWallet")]
        [Authorize(Policy = "Admin")]//For admin only
        public async Task<IActionResult> AddWalletAsync(int id)
        {
            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            Wallet nWallet = new Wallet();
            var acc = await _accountService.GetAccountByIDAsync(id);
            /*if (acc != null)
            {
                Message = "Wallet already existed!";
                return BadRequest(Message);
            }
            else*/
            if (acc == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }
            nWallet.AccountID = id;
            nWallet.CreatedAt = currentVietnamTime;
            nWallet.UpdatedAt = currentVietnamTime;
            nWallet.Status = (int)WalletStatus.Active;

            await _walletService.AddWalletAsync(nWallet);
            Message = "Wallet created!";

            return Ok(Message);
        }

        // PUT api/<WalletController>/5
        [HttpPut("Deposit")]
        [Authorize(Policy = "Family")]
        public async Task<IActionResult> Deposit(int id, decimal balance, bool isMobile = false)
        {

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var acc = await _accountService.GetAccountByIDAsync(id);

            if (acc == null)
            {
                Message = "Không tìm thấy tài khoản!";
                return NotFound(Message);
            }

            var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);

            if (wallet == null)
            {
                Message = "Không tìm thấy ví!";
                return BadRequest(Message);
            }
            if (wallet.Status == (int)WalletStatus.Inactive)
            {
                Message = "Ví tiền đang bị vô hiệu hóa!";
                return BadRequest(Message);
            }

            if (balance < 0 || balance == 0 || balance < 10000)
            {
                Message = "Nạp ít nhất 10,000VNĐ!";
                return BadRequest(Message);
            }
            DateTimeOffset vietnamTime = TimeZoneInfo.ConvertTime(DateTimeOffset.Now, vietnamTimeZone);

            int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
            int expiredAt = (int)(vietnamTime.ToUnixTimeSeconds() + (60 * 5));

            /*var nFee = balance * (10m / 100m);*/

            var trans = new Transaction
            {
                TransactionID = orderCode,
                WalletID = wallet.WalletID,
                AccountID = acc.AccountID,
                Amount = balance,
                Fee = 0,
                CreatedDate = currentVietnamTime,
                Description = "Nạp tiền vào ví",
                UpdatedDate = currentVietnamTime,
                TransactionType = (int)TransactionType.Deposit,
                Status = (int)TransactionStatus.Pending,
            };

            await _transactionService.AddTransactionAsync(trans);
            var paymentData = new CreatePaymentLinkRequest(

                orderCode,
                "Nạp tiền vào ví",
                (int)balance,
                acc.Name,
                acc.Email,
                expiredAt,
                isMobile
                );

            var paymentUrl = await _paymentService.CreatePaymentLink(paymentData);

            var returnUrl = new PaymentLinkDTO();
            returnUrl.PaymentUrl = paymentUrl;
            wallet.OnHold += balance;
            /*wallet.Balance += balance;*/
            wallet.UpdatedAt = currentVietnamTime;
            Message = "Đã nạp " + balance + " VNĐ" + " vào ví tạm giữ!";

            await _walletService.UpdateWalletAsync(wallet);

            return Ok(returnUrl);
        }

        /*[HttpPut("Withdraw")]
        [Authorize]
        public async Task<IActionResult> Withdraw([FromQuery] int accountID, decimal balance, string bankID)
        {
            var acc = await _accountService.GetAccountByIDAsync(accountID);

            if (acc == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }

            var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);
            if (wallet == null)
            {
                Message = "Wallet not found";
                return NotFound(Message);
            }

            if (balance < 0 || balance == 0 || balance < 1000)
            {
                Message = "Withdraw atleast 1000 VND!";
                return BadRequest(Message);
            }

            var finalBalance = wallet.Balance -= balance;
            if (finalBalance < 0)
            {
                Message = "Not enough money to withdraw";
                return BadRequest(Message);
            }

            int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));

            var trans = new Transaction
            {
                TransactionID = orderCode,
                WalletID = wallet.WalletID,
                AccountID = acc.AccountID,
                Amount = balance,
                Fee = 0,
                CreatedDate = currentVietnamTime,
                Description = "Rút tiền từ ví",
                UpdatedDate = currentVietnamTime,
                TransactionType = (int)TransactionType.Withdrawal,
                Status = (int)TransactionStatus.Pending,
            };

            wallet.UpdatedAt = currentVietnamTime;
            Message = "Withdrawed " + balance + " VND" + " from wallet.";

            await _transactionService.AddTransactionAsync(trans);

            await _walletService.UpdateWalletAsync(wallet);

            return Ok(Message);
        }*/

        [HttpPut("Disable")]
        [Authorize(Policy = "Admin")]//Admin only
        public async Task<IActionResult> WalletDisable(int id)
        {
            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var wallet = await _walletService.GetWalletByIDAsync(id);
            if (wallet == null)
            {
                Message = "Wallet not found!";
                return NotFound(Message);
            }
            if (wallet.Status == (int)WalletStatus.Inactive)
            {
                Message = "Wallet already disabled!";
                return BadRequest(Message);
            }
            wallet.Status = (int)WalletStatus.Inactive;
            wallet.UpdatedAt = currentVietnamTime;

            await _walletService.UpdateWalletAsync(wallet);
            Message = "Wallet disabled!";
            return Ok(Message);
        }

        [HttpPut("Enable")]
        [Authorize(Policy = "Admin")]//Admin only
        public async Task<IActionResult> WalletEnable(int id)
        {
            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var wallet = await _walletService.GetWalletByIDAsync(id);
            if (wallet == null)
            {
                Message = "Wallet not found!";
                return NotFound(Message);
            }
            if (wallet.Status == (int)WalletStatus.Active)
            {
                Message = "Wallet already enabled!";
                return BadRequest(Message);
            }
            wallet.Status = (int)WalletStatus.Active;
            wallet.UpdatedAt = currentVietnamTime;

            await _walletService.UpdateWalletAsync(wallet);
            Message = "Wallet enabled!";
            return Ok(Message);
        }
    }
}