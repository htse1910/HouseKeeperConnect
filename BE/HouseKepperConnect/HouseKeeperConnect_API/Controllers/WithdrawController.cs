using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WithdrawController : ControllerBase
    {
        private readonly IWithdrawService _withdrawService;
        private readonly IAccountService _accountService;
        private readonly IWalletService _walletService;
        private readonly IMapper _mapper;
        private string Message;

        public WithdrawController(IWithdrawService WithdrawService, IAccountService accountService, IMapper mapper, IWalletService walletService)
        {
            _withdrawService = WithdrawService;
            _accountService = accountService;
            _mapper = mapper;
            _walletService = walletService;
        }

        [HttpGet("WithdrawList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<WithdrawDisplayDTO>>> GetWithdrawsAsync([FromQuery] int pageNumber, int pageSize)
        {
            var wi = await _withdrawService.GetAllWithdrawsAsync(pageNumber, pageSize);
            if (wi == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<List<WithdrawDisplayDTO>>(wi);
            return Ok(nWi);
        }

        [HttpGet("WithdrawSuccessInPastWeek")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<WithdrawDisplayDTO>>> GetwiInPastWeek([FromQuery] int pageNumber, int pageSize)
        {
            var wi = await _withdrawService.GetWithdrawsPastWeekAsync(pageNumber, pageSize);
            if (wi == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<List<WithdrawDisplayDTO>>(wi);
            return Ok(nWi);
        }

        [HttpGet("GetTotalWithdraws")]
        [Authorize]
        public async Task<ActionResult<int>> GetTotalwi()
        {
            var num = await _withdrawService.GetTotalWithdrawAsync();
            if (num == 0)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(num);
        }

        [HttpGet("GetWithdrawByID")]
        [Authorize]
        public async Task<ActionResult<WithdrawDisplayDTO>> getwiByID([FromQuery] int id)
        {
            var wi = await _withdrawService.GetWithdrawByIDAsync(id);
            if (wi == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<WithdrawDisplayDTO>(wi);
            return Ok(nWi);
        }

        [HttpGet("GetPendingWithdraws")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<WithdrawDisplayDTO>>> getPendingWithdraws([FromQuery] int pageNumber, int pageSize)
        {
            var wi = await _withdrawService.GetPendingWithdrawsAsync(pageNumber, pageSize);
            if (wi == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<List<WithdrawDisplayDTO>>(wi);
            return Ok(nWi);
        }

        [HttpGet("GetWithdrawByUserID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Withdraw>>> getWithdrawsByUserID([FromQuery] int id, int pageNumber, int pageSize)
        {
            var wi = await _withdrawService.GetWithdrawsByUserAsync(id, pageNumber, pageSize);
            if (wi == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<List<WithdrawDisplayDTO>>(wi);
            return Ok(nWi);
        }

        [HttpPost("AddWithdraw")]
        [Authorize]
        public async Task<ActionResult<Withdraw>> CreateWithdraw([FromQuery] WithdrawCreateDTO withdrawCreateDTO)
        {
            var acc = await _accountService.GetAccountByIDAsync(withdrawCreateDTO.AccountID);
            if (acc == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }

            if (string.IsNullOrWhiteSpace(acc.BankAccountNumber))
            {
                Message = "Please update your bank number info in order to withdraw!";
                return BadRequest(Message);
            }

            var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);
            if (wallet == null)
            {
                Message = "Wallet not found!";
                return NotFound(Message);
            }

            if (wallet.Balance < withdrawCreateDTO.Amount)
            {
                Message = "Not enough money to withdraw!";
                return BadRequest(Message);
            }

            if (withdrawCreateDTO.Amount < 1000)
            {
                Message = "Need to withdraw atleast 1.000VND!";
                return BadRequest(Message);
            }

            wallet.Balance -= withdrawCreateDTO.Amount;
            wallet.UpdatedAt = DateTime.Now;

            await _walletService.UpdateWalletAsync(wallet);

            var wi = _mapper.Map<Withdraw>(withdrawCreateDTO);
            wi.RequestDate = DateTime.Now;
            wi.BankNumber = acc.BankAccountNumber;
            wi.Status = (int)TransactionStatus.Pending;

            await _withdrawService.AddWithdrawAsync(wi);
            Message = "Withdrawal Requested!";
            return Ok(Message);
        }

        [HttpPut("UpdateWithdraw")] //Staff Only
        [Authorize]
        public async Task<ActionResult<Withdraw>> UpdateWithdraw([FromQuery] WithdrawUpdateDTO withdrawUpdateDTO)
        {
            var wi = await _withdrawService.GetWithdrawByIDAsync(withdrawUpdateDTO.WithdrawID);

            if (wi == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            if (wi.BankNumber == null)
            {
                Message = "Bank number not found!";
                return NotFound(Message);
            }

            wi.Status = withdrawUpdateDTO.Status;

            await _withdrawService.UpdateWithdrawAsync(wi);
            Message = "Updated!";
            return Ok(Message);
        }
    }
}