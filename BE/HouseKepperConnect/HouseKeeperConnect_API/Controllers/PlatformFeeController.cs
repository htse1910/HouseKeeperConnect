using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlatformFeeController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly INotificationService _notificationService;
        private readonly IPlatformFeeService _platformFeeService;
        private readonly IMapper _mapper;
        private string Message;

        public PlatformFeeController(IAccountService accountService, INotificationService notificationService,
            IPlatformFeeService platformFeeService, IMapper mapper)
        {
            _accountService = accountService;
            _notificationService = notificationService;
            _platformFeeService = platformFeeService;
            _mapper = mapper;
        }

        [HttpGet("PlatformFeeList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<List<FeeDisplayDTO>>> GetFeeList([FromQuery] int pageNumber, int pageSize)
        {
            var fList = await _platformFeeService.GetAllPlatformFeesAsync(pageNumber, pageSize);
            if (fList == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var dispaly = _mapper.Map<List<FeeDisplayDTO>>(fList);
            return Ok(dispaly);
        }

        [HttpGet("GetPlatformFeeByID")]
        [Authorize]
        public async Task<ActionResult<FeeDisplayDTO>> GetPlatformFeeByID([FromQuery] int fID)
        {
            var fee = await _platformFeeService.GetPlatformFeeByIDAsync(fID);
            if (fee == null)
            {
                Message = "No Fee info found!";
                return NotFound(Message);
            }

            var display = _mapper.Map<FeeDisplayDTO>(fee);

            return Ok(display);
        }

        [HttpPost("AddFee")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> AddFee([FromQuery] int percent)
        {
            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var nFee = new PlatformFee();
            int id = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
            nFee.FeeID = id;
            nFee.Percent = percent;
            nFee.CreatedDate = currentVietnamTime;
            nFee.UpdatedDate = currentVietnamTime;

            await _platformFeeService.AddPlatformFeeAsync(nFee);
            Message = "New fee added!";
            return Ok(Message);
        }

        [HttpPut("UpdateFee")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> UpdateFee([FromQuery] decimal percent, int fID)
        {

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var fee = await _platformFeeService.GetPlatformFeeByIDAsync(fID);
            if (fee == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            fee.Percent = percent / 100m;
            fee.UpdatedDate = currentVietnamTime;

            await _platformFeeService.UpdatePlatformFeeAsync(fee);

            //Gửi thông báo toàn account
            var lAcc = await _accountService.GetAllAccountsAsync();
            if (lAcc.Count == 0)
            {
                Message = "No accounts found!";
                return NotFound(Message);
            }

            foreach (var account in lAcc)
            {
                var noti = new Notification();
                noti.Message = "Nền tảng đã cập nhập phí nền tảng thành " + fee.Percent * 100 + "%" + " có hiệu lực từ " + fee.UpdatedDate.ToString("dd/MM/yyyy");
                noti.AccountID = account.AccountID;
                noti.CreatedDate = currentVietnamTime;

                await _notificationService.AddNotificationAsync(noti);
            }
            Message = "Fee updated!";
            return Ok(Message);
        }
    }
}