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
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        private string Message;

        public NotificationController(INotificationService notificationService, IAccountService accountService, IMapper mapper)
        {
            _notificationService = notificationService;
            _accountService = accountService;
            _mapper = mapper;
        }

        [HttpGet("NotificationList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<NotificationDisplayDTO>>> GetNotificationsAsync([FromQuery] int pageNumber, int pageSize)
        {
            var wi = await _notificationService.GetAllNotificationsAsync(pageNumber, pageSize);
            if (wi == null)
            {
                Message = "Không có thông báo nào!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<List<NotificationDisplayDTO>>(wi);
            return Ok(nWi);
        }

        [HttpGet("GetTotalUnReadNotiByUser")]
        [Authorize]
        public async Task<ActionResult<int>> GetTotalUnNoti([FromQuery] int id)
        {
            var num = await _notificationService.GetTotalNotisByUserAsync(id);
            if (num == 0)
            {
                Message = "Không có thông báo nào!";
                return NotFound(Message);
            }

            return Ok(num);
        }

        [HttpGet("GetNotificationByID")]
        [Authorize]
        public async Task<ActionResult<NotificationDisplayDTO>> GetNotiByID([FromQuery] int id)
        {
            var wi = await _notificationService.GetNotificationByIDAsync(id);
            if (wi == null)
            {
                Message = "Không tìm thấy thông báo!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<NotificationDisplayDTO>(wi);
            return Ok(nWi);
        }

        [HttpGet("GetNotificationByUserID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<NotificationDisplayDTO>>> GetNotificationsByUserID([FromQuery] int id, int pageNumber, int pageSize)
        {
            var wi = await _notificationService.GetNotificationsByUserAsync(id, pageNumber, pageSize);
            if (wi == null)
            {
                Message = "Không có thông báo nào!";
                return NotFound(Message);
            }
            var nWi = _mapper.Map<List<NotificationDisplayDTO>>(wi);
            return Ok(nWi);
        }

        [HttpPost("AddNotification")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult> AddNotification([FromQuery] NotificationCreateDTO notificationCreateDTO)
        {
            var acc = await _accountService.GetAccountByIDAsync(notificationCreateDTO.AccountID);
            if (acc == null)
            {
                Message = "Không có tìm thấy tài khoản";
                return NotFound(Message);
            }
            var noti = _mapper.Map<Notification>(notificationCreateDTO);
            noti.AccountID = acc.AccountID;

            await _notificationService.AddNotificationAsync(noti);
            Message = "Tài khoản " + acc.Email + " đã được thông báo!";
            return Ok(Message);
        }

        [HttpPut("IsRead")]
        [Authorize]
        public async Task<ActionResult> UpdateStatusNoti([FromQuery] int id)
        {
            var noti = await _notificationService.GetNotificationByIDAsync(id);
            if (noti == null)
            {
                Message = "Không có thông báo nào!";
                return NotFound(Message);
            }

            noti.IsRead = true;

            await _notificationService.UpdateNotificationAsync(noti);
            Message = "Thông báo đã được đọc!";
            return Ok(Message);
        }
    }
}