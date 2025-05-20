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
    public class PayoutController : ControllerBase
    {
        private readonly IPayoutService _payoutService;
        private readonly IHouseKeeperService _houseKeeperService;
        private readonly IBookingService _bookingService;
        private readonly IJobService _jobService;
        private readonly IJob_ServiceService _job_service;
        private readonly INotificationService _notificationService;
        private readonly IWalletService _walletService;
        private readonly ITransactionService _transactionService;
        private string Message;

        public PayoutController(IPayoutService payoutService, IHouseKeeperService houseKeeperService,
            IBookingService bookingService, IJob_ServiceService job_ServiceService, IJobService jobService,
            INotificationService notificationService, IWalletService walletService, ITransactionService transactionService)
        {
            _payoutService = payoutService;
            _houseKeeperService = houseKeeperService;
            _bookingService = bookingService;
            _jobService = jobService;
            _job_service = job_ServiceService;
            _notificationService = notificationService;
            _walletService = walletService;
            _transactionService = transactionService;
        }

        [HttpGet("PayoutList")]
        [Authorize("Admin")]
        public async Task<ActionResult<List<Payout>>> GetPayoutList([FromQuery] int pageNumber, int pageSize)
        {
            var list = await _payoutService.GetAllPayoutsAsync(pageNumber, pageSize);
            if (list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(list);
        }

        [HttpGet("CountPayoutsByHK")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult<int>> CountPayoutsByHKAsync(int accountID)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if (hk == null)
            {
                Message = "Không tìm thấy người giúp việc!";
                return NotFound(Message);
            }
            var count = await _payoutService.CountPayoutByHKAsync(hk.HousekeeperID);

            return Ok(count);
        }

        [HttpGet("GetPayoutsByHK")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult<List<Payout>>> GetPayoutsByHK([FromQuery] int accountID, int pageNumber, int pageSize)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if (hk == null)
            {
                Message = "Không tìm thấy người giúp việc!";
                return NotFound(Message);
            }
            var list = await _payoutService.GetPayoutsByHKAsync(hk.HousekeeperID, pageNumber, pageSize);
            if (list == null)
            {
                Message = "Dach sách tiền lương trống!";
                return NotFound(Message);
            }

            var display = new List<PayoutDisplayDTO>();

            foreach (var item in list)
            {
                var booking = await _bookingService.GetBookingByIDAsync(item.BookingID);
                if (booking == null)
                {
                    Message = "Không tìm thấy công việc đã nhận!";
                    return NotFound(Message);
                }

                var job = await _jobService.GetJobByIDAsync(booking.JobID);
                if (job == null)
                {
                    Message = "Không tìm thấy thông tin công việc!";
                    return NotFound(Message);
                }

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
                if (jobDetail == null)
                {
                    Message = "Không tìm thấy thông tin chi tiết công việc!";
                    return NotFound(Message);
                }

                var services = await _job_service.GetJob_ServicesByJobIDAsync(job.JobID);
                if (services == null)
                {
                    Message = "Danh sách dịch vụ của công việc trống!";
                    return NotFound(Message);
                }

                var serList = new List<int>();
                foreach (var service in services)
                {
                    serList.Add(service.ServiceID);
                }

                var dis = new PayoutDisplayDTO();
                dis.services = serList;
                dis.Status = item.Status;
                dis.Amount = item.Amount;
                dis.FamilyID = job.FamilyID;
                dis.FamilyName = job.Family.Account.Name;
                dis.BankAccountNumber = job.Family.Account.BankAccountNumber;
                dis.Phone = job.Family.Account.Phone;
                dis.PayoutID = item.PayoutID;
                dis.JobID = job.JobID;
                dis.JobName = job.JobName;
                dis.PayoutDate = item.PayoutDate.GetValueOrDefault();

                display.Add(dis);
            }
            return Ok(display);
        }

        [HttpPost("AddPayout")]
        [Authorize]
        public async Task<ActionResult> AddPayout([FromQuery] int accountID, int bookingID)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if (hk == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var booking = await _bookingService.GetBookingByIDAsync(bookingID);
            if (booking == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var job = await _jobService.GetJobByIDAsync(booking.JobID);
            if (job == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var JobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (JobDetail == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var payout = new Payout();
            payout.Status = (int)PayoutStatus.Pending;
            payout.BookingID = bookingID;
            payout.HousekeeperID = hk.HousekeeperID;
            payout.Amount = JobDetail.Price;

            await _payoutService.AddPayoutAsync(payout);
            Message = "Added Payout!";
            return Ok(Message);
        }

        [HttpPut("UpdatePayout")]
        [Authorize]
        public async Task<ActionResult> UpdatePayout([FromQuery] int payoutID, int status)
        {
            var pay = await _payoutService.GetPayoutByIDAsync(payoutID);
            if (pay == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var hk = await _houseKeeperService.GetHousekeeperByIDAsync(pay.HousekeeperID);
            if (hk == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var noti = new Notification();
            noti.AccountID = hk.AccountID;
            if (status == (int)PayoutStatus.Completed)
            {
                pay.Status = status;
                noti.Message = pay.Amount + " đã được chuyển vào ví của bạn";
            }

            await _payoutService.UpdatePayoutAsync(pay);
            await _notificationService.AddNotificationAsync(noti);

            Message = "Payout updated!";
            return Ok(Message);
        }
    }
}