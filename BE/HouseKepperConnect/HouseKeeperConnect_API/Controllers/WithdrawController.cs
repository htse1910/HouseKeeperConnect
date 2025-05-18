using Appwrite;
using Appwrite.Models;
using Appwrite.Services;
using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.AppWrite;
using BusinessObject.Models.Enum;
using HouseKeeperConnect_API.CustomServices;
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
        private readonly ITransactionService _transactionService;
        private readonly IMapper _mapper;
        private readonly EmailHelper _emailHelper;
        private readonly IConfiguration _configuration;
        private readonly Client _appWriteClient;
        private string Message;

        public WithdrawController(IWithdrawService WithdrawService, IAccountService accountService,
            IMapper mapper, IWalletService walletService, INotificationService notificationService,
            ITransactionService transactionService, EmailHelper emailHelper, IConfiguration configuration)
        {
            _withdrawService = WithdrawService;
            _accountService = accountService;
            _mapper = mapper;
            _walletService = walletService;
            _notificationService = notificationService;
            _transactionService = transactionService;
            _emailHelper = emailHelper;
            _configuration = configuration;
            AppwriteSettings appW = new AppwriteSettings()
            {
                ProjectId = configuration.GetValue<string>("Appwrite:ProjectId"),
                Endpoint = configuration.GetValue<string>("Appwrite:Endpoint"),
                ApiKey = configuration.GetValue<string>("Appwrite:ApiKey")
            };
            _appWriteClient = new Client().SetProject(appW.ProjectId).SetEndpoint(appW.Endpoint).SetKey(appW.ApiKey);
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
        [Authorize(Policy = "Admin")]
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
                Message = "Hãy cập nhật thông tin ngân hàng của bạn trước khi rút tiền!";
                return BadRequest(Message);
            }

            var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);
            if (wallet == null)
            {
                Message = "Không tìm thấy ví!";
                return NotFound(Message);
            }

            if(wallet.Balance < 0)
            {
                Message = "Số tiền cần rút không được âm!";
                return BadRequest(Message);
            }

            if (wallet.Balance < withdrawCreateDTO.Amount)
            {
                Message = "Không đủ tiền để rút!";
                return BadRequest(Message);
            }

            if (withdrawCreateDTO.Amount < 10000)
            {
                Message = "Cần phải rút ít nhất 10,000VNĐ!";
                return BadRequest(Message);
            }

            wallet.Balance -= withdrawCreateDTO.Amount;
            wallet.UpdatedAt = DateTime.Now;

            await _walletService.UpdateWalletAsync(wallet);

            int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
            var trans = new Transaction
            {
                TransactionID = orderCode,
                WalletID = wallet.WalletID,
                AccountID = acc.AccountID,
                Amount = withdrawCreateDTO.Amount,
                Fee = 0,
                CreatedDate = DateTime.Now,
                Description = "Rút tiền về tài khoản ngân hàng",
                UpdatedDate = DateTime.Now,
                TransactionType = (int)TransactionType.Withdrawal,
                Status = (int)TransactionStatus.Pending,
            };

            await _transactionService.AddTransactionAsync(trans);

            var wi = _mapper.Map<Withdraw>(withdrawCreateDTO);
            wi.RequestDate = DateTime.Now;
            wi.BankNumber = acc.BankAccountNumber;
            wi.TransactionID = orderCode;
            wi.Status = (int)TransactionStatus.Pending;

            await _withdrawService.AddWithdrawAsync(wi);

            var noti = new Notification();
            noti.AccountID = wi.AccountID;
            noti.Message = "Bạn đã tạo đơn rút " + wi.Amount + " VND" + " về STK: " + wi.BankNumber + " thành công!";

            await _notificationService.AddNotificationAsync(noti);
            Message = "Yêu cầu rút tiền thành công!";
            return Ok(Message);
        }

        [HttpPut("UpdateWithdraw")] //Staff Only
        [Authorize(Policy = "Staff")]
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
                Message = "Không tìm thấy STK ngân hàng!";
                return NotFound(Message);
            }

            if (withdrawUpdateDTO.Status == (int)WithdrawStatus.OTPVerify)
            {
                Message = "Chỉ xác nhận hoặc từ chối!";
                return BadRequest(Message);
            }

            if (withdrawUpdateDTO.Picture != null && withdrawUpdateDTO.Status == (int)WithdrawStatus.Success)
            {
                var storage = new Storage(_appWriteClient);
                var buckID = "67e3d029000d5b9dd68e";
                var projectID = _configuration.GetValue<string>("Appwrite:ProjectId");
                List<string> perms = new List<string>() { Permission.Write(Appwrite.Role.Any()), Permission.Read(Appwrite.Role.Any()) };

                var id = Guid.NewGuid().ToString();
                var avatar = InputFile.FromStream(
            withdrawUpdateDTO.Picture.OpenReadStream(),
             withdrawUpdateDTO.Picture.FileName,
            withdrawUpdateDTO.Picture.ContentType
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

                wi.Picture = avatarUrl;
            }

            wi.Status = withdrawUpdateDTO.Status;

            await _withdrawService.UpdateWithdrawAsync(wi);

            var wallet = await _walletService.GetWalletByUserAsync(wi.AccountID);

            if (wallet == null)
            {
                Message = "Không tìm thấy ví!";
                return NotFound(Message);
            }

            /*wallet.Balance += wi.Amount;
            wallet.UpdatedAt = DateTime.Now;*/
            if (withdrawUpdateDTO.Status == (int)WithdrawStatus.Failed)
            {
                wallet.Balance += wi.Amount;
            }

            wallet.UpdatedAt = DateTime.Now;

            await _walletService.UpdateWalletAsync(wallet);

            var trans = await _transactionService.GetTransactionByIDAsync(wi.TransactionID);

            if (trans == null)
            {
                Message = "Không tìm thấy lịch sử giao dịch!";
                return NotFound(Message);
            }

            var noti = new Notification();
            noti.AccountID = wi.AccountID;
            if (wi.Status == (int)WithdrawStatus.Success)
            {
                trans.Status = (int)TransactionStatus.Completed;
                trans.Description = "Rút " + wi.Amount + "VND" + " về STK: " + wi.BankNumber + " thành công!";
                noti.Message = "Bạn đã rút " + wi.Amount + "VND" + " về STK: " + wi.BankNumber + " thành công!";
            }
            else
            {
                trans.Status = (int)TransactionStatus.Canceled;
                trans.Description = "Rút " + wi.Amount + "VND" + " về STK: " + wi.BankNumber + " thất bại!";
                noti.Message = "Rút tiền thất bại. " + (int)wi.Amount + " VND" + " đã được hoàn về ví của bạn! Vui lòng thử lại hoặc liên hệ hỗ trợ!";
            }

            await _transactionService.UpdateTransactionAsync(trans);

            await _notificationService.AddNotificationAsync(noti);
            Message = "Đơn đã được xử lý!";
            return Ok(Message);
        }

        [HttpPost("RequestWithdrawOTP")]
        [Authorize]
        public async Task<ActionResult<object>> RequestWithdrawOTP([FromQuery] WithdrawCreateDTO withdrawCreateDTO)
        {
            try
            {
                var acc = await _accountService.GetAccountByIDAsync(withdrawCreateDTO.AccountID);
                if (acc == null)
                    return NotFound("Không tìm thấy tài khoản!");

                if (string.IsNullOrWhiteSpace(acc.BankAccountNumber))
                    return BadRequest("Xin hãy cập nhật thông tin ngân hàng trước khi rút tiền!");

                var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);
                if (wallet == null)
                    return NotFound("Không tìm thấy ví!");

                if(withdrawCreateDTO.Amount == 0)
                {
                    return BadRequest("Số tiền muốn rút không được âm");
                }

                if (wallet.Balance < withdrawCreateDTO.Amount)
                    return BadRequest("Không đủ tiền để rút!");

                if (withdrawCreateDTO.Amount < 10000)
                    return BadRequest("Cần rút tối thiểu 10,000VNĐ!");

                if (string.IsNullOrEmpty(acc.Email))
                    return BadRequest("Không tìm thấy email của tài khoản!");

                int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
                var otp = GenerateOTP();
                // Tạo OTP và Withdraw
                var withdraw = _mapper.Map<Withdraw>(withdrawCreateDTO);
                withdraw.TransactionID = orderCode;
                withdraw.RequestDate = DateTime.Now;
                withdraw.BankNumber = acc.BankAccountNumber;
                withdraw.BankName = acc.BankAccountName;
                withdraw.Status = (int)TransactionStatus.Pending;
                withdraw.OTPCode = otp;
                withdraw.OTPCreatedTime = DateTime.Now;
                withdraw.OTPExpiredTime = DateTime.Now.AddMinutes(5);
                withdraw.IsOTPVerified = false;

                var staffList = await _accountService.GetAllStaffsAsync();
                if (staffList.Count==0)
                {
                    Message = "Không tìm thấy danh sách nhân viên!";
                    return NotFound(Message);
                }

                foreach (var staff in staffList)
                {
                    var noti = new Notification();
                    noti.Message = "Có đơn rút tiền cần xử lý!";
                    noti.AccountID = staff.AccountID;

                    await _notificationService.AddNotificationAsync(noti);
                }

                    
                var trans = new Transaction
                {
                    TransactionID = orderCode,
                    WalletID = wallet.WalletID,
                    AccountID = withdraw.AccountID,
                    Amount = withdraw.Amount,
                    Fee = 0,
                    CreatedDate = DateTime.Now,
                    Description = "Yêu cầu rút tiền đang chờ xác minh OTP",
                    UpdatedDate = DateTime.Now,
                    TransactionType = (int)TransactionType.Withdrawal,
                    Status = (int)TransactionStatus.Pending
                };

                await _transactionService.AddTransactionAsync(trans);
                await _withdrawService.AddWithdrawAsync(withdraw);

                // Gửi OTP
                const string subject = "Mã xác nhận rút tiền";
                string body = $"Mã xác nhận rút tiền của bạn là: {otp}. Mã có hiệu lực trong 5 phút.";
                await _emailHelper.SendEmailAsync(acc.Email, subject, body);

                return Ok(new
                {
                    withdraw.WithdrawID,
                    withdraw.OTPExpiredTime
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("NewOTP")]
        [Authorize]
        public async Task<ActionResult<object>> NewOTP([FromQuery] int withdrawID)
        {
            var w = await _withdrawService.GetWithdrawByIDAsync(withdrawID);
            w.OTPCode = GenerateOTP();
            w.OTPCreatedTime = DateTime.Now;
            w.OTPExpiredTime = DateTime.Now.AddMinutes(5);
            await _withdrawService.UpdateWithdrawAsync(w);

            return Ok(new
            {
                w.OTPCode,
                w.OTPExpiredTime
            });
        }

        private static string GenerateOTP()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        [HttpPost("VerifyOTP")]
        [Authorize]
        public async Task<ActionResult> VerifyOTP([FromQuery] int withdrawID, [FromQuery] string otp)
        {
            try
            {
                var withdraw = await _withdrawService.GetWithdrawByIDAsync(withdrawID);
                if (withdraw == null)
                {
                    Message = "Withdraw request not found!";
                    return NotFound(Message);
                }

                if (withdraw.OTPCode != otp)
                {
                    Message = "Mã OTP không đúng";
                    return BadRequest(Message);
                }

                if (withdraw.Status == (int)TransactionStatus.Completed)
                {
                    Message = "This transaction has already been processed.";
                    return BadRequest(Message);
                }

                withdraw.Status = (int)WithdrawStatus.OTPVerify;
                withdraw.IsOTPVerified = true;

                await _withdrawService.UpdateWithdrawAsync(withdraw);

/*                // Cập nhật Transaction tương ứng nếu có
                if (withdraw.TransactionID != 0)
                {
                    var trans = await _transactionService.GetTransactionByIDAsync(withdraw.TransactionID);
                    if (trans != null)
                    {
                        trans.Status = (int)TransactionStatus.Completed;
                        trans.UpdatedDate = DateTime.Now;

                        await _transactionService.UpdateTransactionAsync(trans);
                    }
                }*/

                // Trừ tiền khỏi ví người dùng
                var wallet = await _walletService.GetWalletByUserAsync(withdraw.AccountID);
                if (wallet != null)
                {
                    wallet.Balance -= withdraw.Amount;
                    await _walletService.UpdateWalletAsync(wallet);
                }

                return Ok("OTP verified and transaction completed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}