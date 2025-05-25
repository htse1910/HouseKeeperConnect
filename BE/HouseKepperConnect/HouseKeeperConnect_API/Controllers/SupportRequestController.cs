using Appwrite;
using Appwrite.Models;
using Appwrite.Services;
using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.AppWrite;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportRequestController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ISupportRequestService _supportRequestService;
        private readonly IMapper _mapper;
        private readonly Client _appWriteClient;
        private readonly IConfiguration _configuration;
        private readonly INotificationService _notificationService;
        private string Message;

        public SupportRequestController(IAccountService accountService,
            ISupportRequestService supportRequestService, IMapper mapper, IConfiguration configuration, INotificationService notificationService)
        {
            _accountService = accountService;
            _supportRequestService = supportRequestService;
            _mapper = mapper;
            _configuration = configuration;
            AppwriteSettings appW = new AppwriteSettings()
            {
                ProjectId = configuration.GetValue<string>("Appwrite:ProjectId"),
                Endpoint = configuration.GetValue<string>("Appwrite:Endpoint"),
                ApiKey = configuration.GetValue<string>("Appwrite:ApiKey")
            };
            _appWriteClient = new Client().SetProject(appW.ProjectId).SetEndpoint(appW.Endpoint).SetKey(appW.ApiKey);
            _notificationService = notificationService;
        }

        [HttpGet("SupportRequestList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<List<SupportRequestDisplayDTO>>> GetRequestList([FromQuery] int pageNumber, int pageSize)
        {
            var reqL = await _supportRequestService.GetAllSupportRequestsAsync(pageNumber, pageSize);
            if (reqL == null)
            {
                Message = "No requests found!";
                return NotFound(Message);
            }

            var display = _mapper.Map<SupportRequestDisplayDTO>(reqL);
            return Ok(display);
        }

        [HttpGet("GetSupportRequestByAccount")]
        [Authorize]
        public async Task<ActionResult<List<SupportRequestDisplayDTO>>> GetRequestListByAccount([FromQuery] int id, int pageNumber, int pageSize)
        {
            var acc = _accountService.GetAccountByIDAsync(id);
            if (acc == null)
            {
                Message = " No account found!";
                return NotFound(Message);
            }

            var reqL = await _supportRequestService.GetSupportRequestByUserAsync(id, pageNumber, pageSize);
            if (reqL == null)
            {
                Message = "Không tìm thấy đơn hỗ trợ nào!";
                return NotFound(Message);
            }
            var display = new List<SupportRequestDisplayDTO>();

            _mapper.Map(reqL, display);
            return Ok(display);
        }

        [HttpPost("AddSupportRequest")]
        [Authorize]
        public async Task<ActionResult> AddRequest([FromQuery] SupportRequestCreateDTO requestCreateDTO)
        {
            if (!ModelState.IsValid)
            {
                Message = "Hãy kiểm tra lại thông tin nhập vào";
                return BadRequest(Message);
            }
            var acc = await _accountService.GetAccountByIDAsync(requestCreateDTO.RequestedBy);
            if (acc == null)
            {
                Message = "không tìm thấy tài khoản!";
                return NotFound(Message);
            }

            var req = _mapper.Map<SupportRequest>(requestCreateDTO);

            if (requestCreateDTO.Picture != null)
            {
                var storage = new Storage(_appWriteClient);
                var buckID = "67e3d029000d5b9dd68e";
                var projectID = _configuration.GetValue<string>("Appwrite:ProjectId");
                List<string> perms = new List<string>() { Permission.Write(Appwrite.Role.Any()), Permission.Read(Appwrite.Role.Any()) };

                var id = Guid.NewGuid().ToString();
                var picture = InputFile.FromStream(
                    requestCreateDTO.Picture.OpenReadStream(),
                    requestCreateDTO.Picture.FileName,
                    requestCreateDTO.Picture.ContentType
                );
                var response = await storage.CreateFile(
                    buckID,
                    id,
                    picture,
                    perms,
                    null
                    );
                var picID = response.Id;
                var picUrl = $"{_appWriteClient.Endpoint}/storage/buckets/{response.BucketId}/files/{picID}/view?project={projectID}";

                req.Picture = picUrl;
            }
            req.Status = (int)SupportRequestStatus.Processing;

            await _supportRequestService.AddSupportRequestAsync(req);
            Message = "Tạo đơn yêu cầu hỗ trợ thành công!";
            return Ok(Message);
        }

        [HttpPut("VerifySupportRequest")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult> VerifyRequest([FromQuery] SupportRequestUpdateDTO supportRequestUpdateDTO)
        {

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            // Check tải khoản staff có tồn tại?
            var staff = await _accountService.GetAccountByIDAsync(supportRequestUpdateDTO.AccountID);
            if (staff == null)
            {
                Message = "Không tìm thấy tài khoản nhân viên!";
                return NotFound(Message);
            }
            //Check đơn có tồn tại?
            var req = await _supportRequestService.GetSupportRequestByIDAsync(supportRequestUpdateDTO.RequestID);
            if (req == null)
            {
                Message = "Không tìm thấy đơn hỗ trợ!";
                return NotFound(Message);
            }

            //Cập nhật lại đơn
            req.Status = (int)SupportRequestStatus.Completed;
            req.ReviewedBy = staff.AccountID;
            req.ReviewNote = supportRequestUpdateDTO.Content;
            req.UpdatedDate = currentVietnamTime;

            await _supportRequestService.UpdateSupportRequestAsync(req);

            //Gửi noti về cho accountID tương ứng

            var noti = new Notification();
            noti.AccountID = req.RequestedBy;
            noti.Message = "Đơn hỗ trợ của bạn đã được xử lý";

            await _notificationService.AddNotificationAsync(noti);

            Message = "Trạng thái đơn đã được cập nhật!";

            return Ok(Message);
        }

        [HttpGet("GetSupportRequestPending")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult<List<SupportRequestDisplayDTO>>> GetRequestListPending([FromQuery] int pageNumber, int pageSize)
        {
            var reqL = await _supportRequestService.GetAllPendingSupportRequestsAsync(pageNumber, pageSize);
            if (reqL == null)
            {
                Message = "Danh sách đơn yêu cầu hỗ trợ trống!";
                return NotFound(Message);
            }
            var display = new List<SupportRequestDisplayDTO>();

            _mapper.Map(reqL, display);
            return Ok(display);
        }
    }
}