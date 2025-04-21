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
    public class VerificationTasksController : ControllerBase
    {
        private readonly IVerificationTaskService _verificationTaskService;
        private readonly IAccountService _accountService;
        private readonly IHouseKeeperService _housekeeperService;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;

        public VerificationTasksController(IVerificationTaskService verificationTaskService, IMapper mapper,
                                          IAccountService accountService, IHouseKeeperService housekeeperService, INotificationService notificationService)
        {
            _verificationTaskService = verificationTaskService;
            _mapper = mapper;
            _accountService = accountService;
            _housekeeperService = housekeeperService;
            _notificationService = notificationService;
        }

        /*[HttpGet("VerificationTaskPending")]
        [Authorize]
        public async Task<ActionResult<VerificationTask>> GetPendingTasks([FromQuery] int pageNumber, int pageSize)
        {
            try
            {
                var tasks = await _verificationTaskService.GetPendingTasksAsync(pageNumber, pageSize);
                if (tasks.Count == 0)
                {
                    return NotFound("No pending verification tasks found.");
                }
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }*/

        [HttpGet("GetVerificationTask")]
        [Authorize]
        public async Task<ActionResult<VerificationTask>> GetVerificationTask([FromQuery] int taskId)
        {
            var task = await _verificationTaskService.GetTaskByIdAsync(taskId);
            if (task == null)
            {
                return NotFound("Verification task not found.");
            }
            return Ok(task);
        }

        [HttpPost("Create")]
        public async Task<ActionResult> CreateVerificationTask([FromQuery] int verifyID)
        {
            try
            {
               
                var verification = await _verificationTaskService.GetTaskByIdAsync(verifyID);
                if (verification == null)
                {
                    return NotFound("No VerificationTask found!");
                }

                var task = new VerificationTask
                {
                    VerifyID = verifyID,
                    Status = 1, 
                    AssignedDate = DateTime.Now
                };

                await _verificationTaskService.CreateVerificationTaskAsync(task);
                return Ok("Verification task created successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Approve")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult> ApproveVerification(int taskId, [FromQuery] VerificationRequestDTO request)
        {
            try
            {
                var task = await _verificationTaskService.GetTaskByIdAsync(taskId);
                if (task == null || task.Status != 1)
                {
                    return BadRequest("Invalid or non-pending verification task.");
                }

                var staff = await _accountService.GetAccountByIDAsync(request.AccountID);
                if (staff == null || staff.RoleID != 3)
                {
                    return Unauthorized("You do not have permission to approve verification.");
                }

                var hk = await _housekeeperService.GetHousekeepersByIDVerifyAsync(task.VerifyID);
                if(hk == null)
                {
                    return NotFound("Housekeeper not found!");
                }

                task.AccountID = request.AccountID;
                task.Status = 2;
                task.CompletedDate = DateTime.Now;
                task.Notes = request.Notes;
                task.IDVerification.Status = 2;

                var noti = new Notification();
                noti.AccountID = hk.AccountID;
                noti.Message = "CCCD/CMND của bạn đã được duyệt!";

                await _notificationService.AddNotificationAsync(noti);
                await _verificationTaskService.UpdateVerificationTaskAsync(task);

                await _housekeeperService.UpdateIsVerifiedAsync(task.IDVerification.VerifyID, true);
                return Ok("Verification task approved successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Reject")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult> RejectVerification(int taskId, [FromQuery] VerificationRequestDTO request)
        {
            try
            {
                var task = await _verificationTaskService.GetTaskByIdAsync(taskId);
                if (task == null || task.Status != 1)
                {
                    return BadRequest("Invalid or non-pending verification task.");
                }

                var staff = await _accountService.GetAccountByIDAsync(request.AccountID);
                if (staff == null || staff.RoleID != 3)
                {
                    return Unauthorized("You do not have permission to reject verification.");
                }

                var hk = await _housekeeperService.GetHousekeepersByIDVerifyAsync(task.VerifyID);
                if (hk == null)
                {
                    return NotFound("Housekeeper not found!");
                }

                task.AccountID = request.AccountID;
                task.Status = (int)VerificationStatus.Denied;
                task.CompletedDate = DateTime.Now;
                task.Notes = request.Notes;
                task.IDVerification.Status = (int)VerificationStatus.Denied;

                await _verificationTaskService.UpdateVerificationTaskAsync(task);

                var noti = new Notification();
                noti.AccountID = hk.AccountID;
                noti.Message = "CCCD/CMND của bạn không được phê duyệt!\nLí do: "+request.Notes;

                await _notificationService.AddNotificationAsync(noti);

                return Ok("Verification task rejected successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}