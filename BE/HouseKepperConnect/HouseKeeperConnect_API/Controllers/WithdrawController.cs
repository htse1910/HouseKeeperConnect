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
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private string Message;

        public WithdrawController(IWithdrawService WithdrawService, IAccountService accountService, IMapper mapper, IWalletService walletService, INotificationService notificationService)
        {
            _withdrawService = WithdrawService;
            _accountService = accountService;
            _mapper = mapper;
            _walletService = walletService;
            _notificationService = notificationService;
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

            var noti = new Notification();
            noti.AccountID = wi.AccountID;
            noti.Message = "Bạn đã tạo đơn rút " + wi.Amount + " VND" + " về STK: " + wi.BankNumber + " thành công!";

            await _notificationService.AddNotificationAsync(noti);
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

            var wallet = await _walletService.GetWalletByUserAsync(wi.AccountID);

            if (wallet == null)
            {
                Message = "Not account found!";
                return NotFound(Message);
            }

            /*wallet.Balance += wi.Amount;
            wallet.UpdatedAt = DateTime.Now;*/
            if (withdrawUpdateDTO.Status == 3)
            {
                wallet.Balance += wi.Amount;
            }

            wallet.UpdatedAt = DateTime.Now;

            await _walletService.UpdateWalletAsync(wallet);

            var noti = new Notification();
            noti.AccountID = wi.AccountID;
            if (wi.Status == (int)WithdrawStatus.Completed)
            {
                noti.Message = "Bạn đã rút " + wi.Amount + "VND" + " về STK: " + wi.BankNumber + " thành công!";
            }
            else
            {
                noti.Message = "Rút tiền thất bại. " + (int)wi.Amount + " VND" + " đã được hoàn về ví của bạn! Vui lòng thử lại hoặc liên hệ hỗ trợ!";
            }

            await _notificationService.AddNotificationAsync(noti);
            Message = "Updated!";
            return Ok(Message);
        }
    }
}