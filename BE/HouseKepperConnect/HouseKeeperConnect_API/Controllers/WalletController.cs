using AutoMapper;
using BusinessObject.Models;
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
        private readonly IMapper _mapper;
        private string Message;

        public WalletController(IWalletService walletService, IPaymentService paymentService, IMapper mapper, IAccountService accountService)
        {
            _walletService = walletService;
            _mapper = mapper;
            _paymentService = paymentService;
            _accountService = accountService;
        }

        // GET: api/<WalletController>
        [HttpGet("WalletList")]
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

        // POST api/<WalletController>
        [HttpPost("AddWallet")] //For admin only
        public async Task<IActionResult> AddWalletAsync(int id)
        {
            Wallet nWallet = new Wallet();
            var acc = await _accountService.GetAccountByIDAsync(id);
            if (acc != null)
            {
                Message = "Wallet already existed!";
                return BadRequest(Message);
            }
            else if (acc == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }
            nWallet.AccountID = id;
            nWallet.CreatedAt = DateTime.Now;
            nWallet.UpdatedAt = DateTime.Now;
            nWallet.Status = (int)WalletStatus.Active;

            await _walletService.AddWalletAsync(nWallet);
            Message = "Wallet created!";

            return Ok(Message);
        }

        // PUT api/<WalletController>/5
        [HttpPut("Deposit")]
        public async Task<IActionResult> Deposit(int id, decimal balance)
        {
            var acc = await _accountService.GetAccountByIDAsync(id);

            if (acc == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }

            var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);

            if (wallet == null)
            {
                Message = "Wallet not found!";
                return BadRequest(Message);
            }
            if (wallet.Status == (int)WalletStatus.Inactive)
            {
                Message = "Wallet is disabled!";
                return BadRequest(Message);
            }


            if (balance < 0 || balance == 0 || balance < 1000)
            {
                Message = "Deposit atleast 1000 VND!";
                return BadRequest(Message);
            }
            /*int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
            int expiredAt = (int)(DateTimeOffset.UtcNow.ToUnixTimeSeconds() + (60 * 5));

            var paymentData = new CreatePaymentLinkRequest(

                orderCode,
                "Nạp tiền vào ví",
                (int)balance,
                acc.Name,
                acc.Email,
                expiredAt
                );

            var paymentUrl = await _paymentService.CreatePaymentLink(paymentData);*/

            /*wallet.OnHold += balance;*/
            wallet.Balance += balance;
            wallet.UpdatedAt = DateTime.Now;
            Message = "Deposited " + balance + " VND" + " to wallet.";

            await _walletService.UpdateWalletAsync(wallet);

            return Ok(Message);
        }

        [HttpPut("Withdraw")]
        [Authorize]
        public async Task<IActionResult> Withdraw(int id, decimal balance)
        {
            var wallet = await _walletService.GetWalletByIDAsync(id);
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
            wallet.UpdatedAt = DateTime.Now;
            Message = "Withdrawed " + balance + " VND" + " from wallet.";

            await _walletService.UpdateWalletAsync(wallet);

            return Ok(Message);
        }

        [HttpPut("Disable")] //Admin only
        public async Task<IActionResult> WalletDisable(int id)
        {
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
            wallet.UpdatedAt = DateTime.Now;

            await _walletService.UpdateWalletAsync(wallet);
            Message = "Wallet disabled!";
            return Ok(Message);
        }

        [HttpPut("Enable")] //Admin only
        public async Task<IActionResult> WalletEnable(int id)
        {
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
            wallet.UpdatedAt = DateTime.Now;

            await _walletService.UpdateWalletAsync(wallet);
            Message = "Wallet enabled!";
            return Ok(Message);
        }
    }
}