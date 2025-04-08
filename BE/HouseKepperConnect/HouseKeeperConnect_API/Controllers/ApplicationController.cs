using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly IAccountService _accountService;
        private readonly IHouseKeeperService _houseKeeperService;
        private readonly IJobListing_ApplicationService _jobListingService;
        private readonly IJobService _jobService;
        private readonly INotificationService _notificationService;
        private readonly IJob_ServiceService _jobServiceService;
        private readonly IJob_SlotsService _jobSlotsService;
        private readonly IBooking_SlotsService _bookingSlotsService;
        private readonly IMapper _mapper;
        private string Message;

        public ApplicationController(IApplicationService applicationService, IAccountService accountService,
            IHouseKeeperService houseKeeperService, IMapper mapper, IJobListing_ApplicationService jobListingService, 
            IJobService jobService, INotificationService notificationService, IJob_ServiceService job_ServiceService,
            IJob_SlotsService job_SlotsService, IBooking_SlotsService bookingSlotsService)
        {
            _applicationService = applicationService;
            _accountService = accountService;
            _houseKeeperService = houseKeeperService;
            _mapper = mapper;
            _jobListingService = jobListingService;
            _jobService = jobService;
            _notificationService = notificationService;
            _jobServiceService = job_ServiceService;
            _jobSlotsService = job_SlotsService;
            _bookingSlotsService = bookingSlotsService;
        }

        [HttpGet("ApplicationList")]
        [Authorize]
        public async Task<ActionResult<Application>> ApplicationList(int pageNumber, int pageSize)
        {
            var list = await _applicationService.GetAllApplicationsAsync(pageNumber, pageSize);
            if (list == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }

            var lA = new List<ApplicationDisplayDTO>();

            foreach (var item in list)
            {
                var display = new ApplicationDisplayDTO();
                display.ApplicationID = item.ApplicationID;
                display.LocalProfilePicture = item.HouseKepper.Account.LocalProfilePicture;
                display.GoogleProfilePicture = item.HouseKepper.Account.GoogleProfilePicture;
                display.AccountID = item.HouseKepper.AccountID;
                display.Nickname = item.HouseKepper.Account.Nickname;
                display.Status = item.Status;
                display.Rating = item.HouseKepper.Rating.GetValueOrDefault();
                lA.Add(display);
            }

            return Ok(lA);
        }

        [HttpGet("ApplicationListByJob")]
        [Authorize]
        public async Task<ActionResult<Application>> ApplicationListByJob(int jobID, int pageNumber, int pageSize)
        {
            var list = await _jobListingService.GetAllJob_ApplicationsByJobAsync(jobID, pageNumber, pageSize);
            if (list == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }

            var lA = new List<ApplicationDisplayDTO>();

            foreach (var item in list)
            {
                var display = new ApplicationDisplayDTO();
                display.ApplicationID = item.ApplicationID;
                display.LocalProfilePicture = item.Application.HouseKepper.Account.LocalProfilePicture;
                display.GoogleProfilePicture = item.Application.HouseKepper.Account.GoogleProfilePicture;
                display.AccountID = item.Application.HouseKepper.AccountID;
                display.Nickname = item.Application.HouseKepper.Account.Nickname;
                display.Status = item.Application.Status;
                display.Rating = item.Application.HouseKepper.Rating.GetValueOrDefault();
                lA.Add(display);
            }

            return Ok(lA);
        }

        [HttpGet("GetApplicationByID")]
        [Authorize]
        public async Task<ActionResult<Application>> GetAppByID(int id)
        {
            var app = await _applicationService.GetApplicationByIDAsync(id);
            if (app == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }

            var display = new ApplicationDisplayDTO();

            display.ApplicationID = app.ApplicationID;
            display.LocalProfilePicture = app.HouseKepper.Account.LocalProfilePicture;
            display.GoogleProfilePicture = app.HouseKepper.Account.GoogleProfilePicture;
            display.AccountID = app.HouseKepper.AccountID;
            display.Nickname = app.HouseKepper.Account.Nickname;
            display.Status = app.Status;
            display.Rating = app.HouseKepper.Rating.GetValueOrDefault();

            return Ok(display);
        }

        [HttpGet("GetApplicationsByAccountID")]
        [Authorize]
        public async Task<ActionResult<List<Application>>> GetAppByAccID([FromQuery]int uid, int pageNumber, int pageSize)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(uid);
            if (hk == null)
            {
                Message = "No housekeeper found!";
                return NotFound(Message);
            }

            var apps = await _applicationService.GetAllApplicationsByUserAsync(hk.HousekeeperID, pageNumber, pageSize);
            if (apps == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }

            var lA = new List<ApplicationDisplayDTO>();

            foreach (var item in apps)
            {
                
                var display = new ApplicationDisplayDTO();
                var services = new List<int>();
                var job = await _jobListingService.GetJob_ApplicationByAppAsync(item.ApplicationID);
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
                var serviceList = await _jobServiceService.GetJob_ServicesByJobIDAsync(job.JobID);

                foreach (var service in serviceList)
                {
                    services.Add(service.ServiceID);
                }
                display.ApplicationID = item.ApplicationID;
                display.LocalProfilePicture = item.HouseKepper.Account.LocalProfilePicture;
                display.GoogleProfilePicture = item.HouseKepper.Account.GoogleProfilePicture;
                display.AccountID = item.HouseKepper.AccountID;
                display.FamilyID = job.Job.FamilyID;
                display.JobID = job.JobID;
                display.StartDate = jobDetail.StartDate;
                display.EndDate = jobDetail.EndDate;
                display.Services = services;
                display.Nickname = item.HouseKepper.Account.Nickname;
                display.Status = item.Status;
                display.Rating = item.HouseKepper.Rating.GetValueOrDefault();
                lA.Add(display);
            }

            return Ok(lA);
        }

        [HttpPost("AddApplication")]
        [Authorize]
        public async Task<ActionResult> AddApplication([FromQuery] int accountID, int jobID)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if (hk == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }

            var job = await _jobService.GetJobByIDAsync(jobID);
            if (job == null)
            {
                Message = "Job not found!";
                return NotFound(Message);
            }

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
            {
                Message = "Job not found!";
                return NotFound(Message);
            }

            var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(job.JobID);
            if (jobSlots == null || !jobSlots.Any())
            {
                return BadRequest("No slots found for the job.");
            }

            List<string> bookedSlotMessages = new List<string>(); // Collect errors
            DateTime currentDate = jobDetail.StartDate;
            while (currentDate <= jobDetail.EndDate)
            {
                foreach (var slot in jobSlots)
                {
                    DateTime bookingDate = GetNextDayOfWeek(currentDate, slot.DayOfWeek);
                    if (bookingDate > jobDetail.EndDate)
                        continue;

                    bool isSlotBooked = await _bookingSlotsService.IsSlotBooked(
                        hk.HousekeeperID, slot.SlotID, slot.DayOfWeek, jobDetail.StartDate, jobDetail.EndDate
                    );

                    if (isSlotBooked)
                    {
                        bookedSlotMessages.Add($"Slot {slot.SlotID} on day {slot.DayOfWeek} is already booked.");
                    }
                }
                currentDate = currentDate.AddDays(7);
            }

            // ✅ If any slot is already booked, do NOT create the booking
            if (bookedSlotMessages.Any())
            {
                return Conflict($"Booking cannot be created because the following slots are already booked:\n{string.Join("\n", bookedSlotMessages)}");
            }

            var app = new Application();
            app.HouseKeeperID = hk.HousekeeperID;
            app.Status = (int)ApplicationStatus.Pending;

            await _applicationService.AddApplicationAsync(app);

            var jA = new JobListing_Application();
            jA.ApplicationID = app.ApplicationID;
            jA.JobID = jobID;

            await _jobListingService.AddJob_ApplicationAsync(jA);

            var noti = new Notification();
            noti.AccountID = accountID;
            noti.Message = "Bạn đã nộp đơn ứng tuyển cho công việc " + jobID;

            await _notificationService.AddNotificationAsync(noti);

            Message = ("Application Added!");
            return Ok(Message);
        }

        private DateTime GetNextDayOfWeek(DateTime startDate, int dayOfWeek)
        {
            int daysUntilNext = ((dayOfWeek - (int)startDate.DayOfWeek + 7) % 7);
            return startDate.AddDays(daysUntilNext == 0 ? 7 : daysUntilNext);
        }

        [HttpPut("UpdateApplication")]
        [Authorize]
        public async Task<ActionResult> UpdateApplication([FromQuery] int AppID, int status)
        {
            var app = await _applicationService.GetApplicationByIDAsync(AppID);
            if (app == null)
            {
                Message = "No application found!";
                return NotFound(Message);
            }

            var job = await _jobListingService.GetJob_ApplicationByAppAsync(app.ApplicationID);
            if (job == null)
            {
                Message = "No job found!";
                return NotFound(Message);
            }

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
            {
                Message = "No job found!";
                return NotFound(Message);
            }


            var noti = new Notification();
            noti.AccountID = app.HouseKepper.AccountID;

            if (jobDetail.HousekeeperID != null)
            {
                Message = "Đã có người được tuyển cho công việc này!";
                return Forbid(Message);
            }
            if (status == (int)ApplicationStatus.Accepted)
            {
                Message = "Application Accepted!";
                noti.Message = "Đơn ứng tuyển của bạn cho công việc" + job.JobID + " đã được chấp thuận!";
                jobDetail.HousekeeperID = app.HouseKeeperID;
            }
            if (status == (int)ApplicationStatus.Denied)
            {
                Message = "Đơn của bạn đã bị từ chối!";
                noti.Message = "Đơn ứng tuyển của bạn cho công việc " + job.JobID + " đã bị từ chối!";
            }

            await _jobService.UpdateJobDetailAsync(jobDetail);
            await _notificationService.AddNotificationAsync(noti);
            app.Status = status;

            await _applicationService.UpdateApplicationAsync(app);
            Message = "Application status updated!";
            return Ok(Message);
        }
    }
}