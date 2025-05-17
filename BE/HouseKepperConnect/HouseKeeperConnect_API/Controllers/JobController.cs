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
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly IJob_ServiceService _jobServiceService;
        private readonly IJob_SlotsService _jobSlotsService;
        private readonly IBookingService _bookingService;
        private readonly IBooking_SlotsService _bookingSlotsService;
        private readonly INotificationService _notificationService;
        private readonly IFamilyProfileService _familyProfileService;
        private readonly IHouseKeeperService _houseKeeperService;
        private readonly IServiceService _serviceService;
        private readonly IAccountService _accountService;
        private readonly ITransactionService _transactionService;
        private readonly IWalletService _walletService;
        private readonly IPaymentService _paymentService;
        private readonly IPayoutService _payoutService;
        private readonly IPlatformFeeService _platformFeeService;
        private readonly IApplicationService _applicationService;
        private string Message;
        private readonly IMapper _mapper;

        public JobController(IJobService jobService, IMapper mapper, IJob_ServiceService job_ServiceService, IJob_SlotsService job_SlotsService, IBookingService bookingService, IBooking_SlotsService bookingSlotsService, INotificationService notificationService,
            IFamilyProfileService familyProfileService, IHouseKeeperService houseKeeperService,
            IServiceService serviceService, IAccountService accountService, ITransactionService transactionService,
            IWalletService walletService, IPaymentService paymentService, IPayoutService payoutService,
            IPlatformFeeService platformFeeService, IApplicationService applicationService)
        {
            _jobService = jobService;
            _jobServiceService = job_ServiceService;
            _jobSlotsService = job_SlotsService;
            _mapper = mapper;
            _bookingService = bookingService;
            _bookingSlotsService = bookingSlotsService;
            _notificationService = notificationService;
            _familyProfileService = familyProfileService;
            _houseKeeperService = houseKeeperService;
            _serviceService = serviceService;
            _accountService = accountService;
            _transactionService = transactionService;
            _walletService = walletService;
            _paymentService = paymentService;
            _payoutService = payoutService;
            _platformFeeService = platformFeeService;
            _applicationService = applicationService;
        }

        [HttpGet("JobList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsAsync(int pageNumber, int pageSize)
        {
            var jobs = await _jobService.GetAllJobsAsync(pageNumber, pageSize);

            if (jobs == null || !jobs.Any())
            {
                return NotFound("Không tìm thấy thông tin công việc!");
            }
            var display = new List<JobDisplayDTO>();
            foreach (var j in jobs)
            {
                var d = new JobDisplayDTO();
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(j.JobID);
                d.JobName = j.JobName;
                d.FamilyID = j.FamilyID;
                d.Location = jobDetail.Location;
                d.DetailLocation = jobDetail.DetailLocation;
                d.Price = jobDetail.Price;
                d.CreatedAt = j.CreatedDate;
                d.Status = j.Status;
                d.JobType = j.JobType;
                d.JobID = j.JobID;
                display.Add(d);
            }

            return Ok(display);
        }
        
        [HttpGet("JobVerifiedListStaff")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsVerifiedStaffAsync(int pageNumber, int pageSize)
        {
            var jobs = await _jobService.GetAllJobsForStaffAsync(pageNumber, pageSize);

            if (jobs == null || !jobs.Any())
            {
                return NotFound("Không tìm thấy thông tin công việc!");
            }
            var display = new List<JobDisplayDTO>();
            foreach (var j in jobs)
            {
                var d = new JobDisplayDTO();
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(j.JobID);
                d.JobName = j.JobName;
                d.FamilyID = j.FamilyID;
                d.Location = jobDetail.Location;
                d.DetailLocation = jobDetail.DetailLocation;
                d.Price = jobDetail.Price;
                d.CreatedAt = j.CreatedDate;
                d.Status = j.Status;
                d.JobType = j.JobType;
                d.JobID = j.JobID;
                display.Add(d);
            }

            return Ok(display);
        }
        
        [HttpGet("JobAcceptedListStaff")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsStaffAsync(int pageNumber, int pageSize)
        {
            var jobs = await _jobService.GetAcceptedJobsForStaffAsync(pageNumber, pageSize);

            if (jobs == null || !jobs.Any())
            {
                return NotFound("Không tìm thấy thông tin công việc!");
            }
            var display = new List<JobDisplayDTO>();
            foreach (var j in jobs)
            {
                {var d = new JobDisplayDTO();
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(j.JobID);
                d.JobName = j.JobName;
                d.FamilyID = j.FamilyID;
                d.Location = jobDetail.Location;
                d.DetailLocation = jobDetail.DetailLocation;
                d.Price = jobDetail.Price;
                d.CreatedAt = j.CreatedDate;
                d.Status = j.Status;
                d.JobType = j.JobType;
                d.JobID = j.JobID;
                display.Add(d);}
            }

            return Ok(display);
        }

        [HttpGet("PendingJobsList")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> PendingJobsAsync(int pageNumber, int pageSize)
        {
            var jobs = await _jobService.GetAllPendingJobsAsync(pageNumber, pageSize);

            if (jobs == null || !jobs.Any())
            {
                return NotFound("No records!");
            }
            var display = new List<JobDisplayDTO>();
            foreach (var j in jobs)
            {
                var d = new JobDisplayDTO();
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(j.JobID);
                d.JobName = j.JobName;
                d.FamilyID = j.FamilyID;
                d.Location = jobDetail.Location;
                d.DetailLocation = jobDetail.DetailLocation;
                d.Price = jobDetail.Price;
                d.CreatedAt = j.CreatedDate;
                d.Status = j.Status;
                d.JobType = j.JobType;
                d.JobID = j.JobID;
                display.Add(d);
            }

            return Ok(display);
        }
        
        [HttpGet("CountPendingJobs")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult<int>> CountPendingJobsAsync()
        {
            var count = await _jobService.CountPendingJobsAsync();

            return Ok(count);
        }
        [HttpGet("CountVerifiedJobs")]
        [Authorize]
        public async Task<ActionResult<int>> CountVerifiedJobsAsync()
        {
            var count = await _jobService.CountVerifiedJobsAsync();

            return Ok(count);
        }
        
        [HttpGet("CountVerifiedJobsStaff")]
        [Authorize]
        public async Task<ActionResult<int>> CountVerifiedJobsStaffAsync()
        {
            var count = await _jobService.CountVerifiedJobsStaffAsync();

            return Ok(count);
        }
        
        [HttpGet("CountAccepteddJobsStaff")]
        [Authorize]
        public async Task<ActionResult<int>> CountAcceptedJobsStaffAsync()
        {
            var count = await _jobService.CountAcceptedJobsStaffAsync();

            return Ok(count);
        }
        
        [HttpGet("CountJobsByAccountID")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult<int>> CountJobsByAccountIDAsync(int accountID)
        {
            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(accountID);
            if (fa == null)
            {
                Message = "Không tìm thấy gia đình!";
                return NotFound(Message);
            }
            var count = await _jobService.CountJobsByAccountIDAsync(fa.FamilyID);

            return Ok(count);
        }
        
        [HttpGet("CountJobsOfferedByAccountID")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult<int>> CountJobsOfferedByAccountIDAsync(int accountID)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if (hk == null)
            {
                Message = "Không tìm thấy người giúp việc!";
                return NotFound(Message);
            }
            var count = await _jobService.CountJobsOfferByAccountIDAsync(hk.HousekeeperID);

            return Ok(count);
        }

        [HttpGet("GetJobByID")]
        [Authorize]
        public async Task<ActionResult<JobDisplayDTO>> GetJobByID([FromQuery] int id)
        {
            var job = await _jobService.GetJobByIDAsync(id);
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

            var nJ = new JobDisplayDTO();
            _mapper.Map(job, nJ);
            _mapper.Map(jobDetail, nJ);
            return Ok(nJ);
        }

        [HttpGet("GetJobDetailByID")]
        [Authorize]
        public async Task<ActionResult<JobDetailDisplayDTO>> GetJobDetailByID([FromQuery] int id)
        {
            var job = await _jobService.GetJobByIDAsync(id);
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

            var services = new List<int>();
            var slots = new List<int>();
            var days = new List<int>();

            var JobSlotDay = await _jobSlotsService.GetJob_SlotsByJobIDAsync(job.JobID);
            var JobService = await _jobServiceService.GetJob_ServicesByJobIDAsync(job.JobID);

            /*            foreach ( var SlotDay in JobSlotDay)
                        {
                            slots.Add(SlotDay.SlotID);
                            days.Add(SlotDay.DayOfWeek);
                        }

                        foreach ( var ser in JobService)
                        {
                            services.Add(ser.ServiceID);
                        }*/

            var displayDTO = new JobDetailDisplayDTO();

            _mapper.Map(job, displayDTO);
            _mapper.Map(jobDetail, displayDTO);
            var booking = await _bookingService.GetBookingByJobIDAsync(job.JobID);
            if (booking == null)
            {
                displayDTO.BookingID = null;
            }
            else
            {
                displayDTO.BookingID = booking.BookingID;
            }

            displayDTO.SlotIDs = JobSlotDay.Select(slot => slot.SlotID).Distinct().ToList();
            displayDTO.DayofWeek = JobSlotDay.Select(slot => slot.DayOfWeek).Distinct().ToList();
            displayDTO.ServiceIDs = JobService.Select(service => service.ServiceID).Distinct().ToList();

            return Ok(displayDTO);
        }

        [HttpGet("GetJobsOfferedByHK")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsOfferedByHK([FromQuery] int accountId, int pageNumber, int pageSize)
        {
            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountId);
            if (hk == null)
            {
                Message = "Không tìm thấy thông tin người giúp việc!";
                return NotFound(Message);
            }
            var jobs = await _jobService.GetJobsOfferedByHKAsync(hk.HousekeeperID, pageNumber, pageSize);
            if (jobs == null || !jobs.Any())
            {
                Message = "Chưa có công việc nào được offer!";
                return NotFound(Message);
            }

            var display = new List<JobDisplayDTO>();
            foreach (var j in jobs)
            {
                var d = new JobDisplayDTO();
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(j.JobID);
                d.JobName = j.JobName;
                d.FamilyID = j.FamilyID;
                d.Location = jobDetail.Location;
                d.DetailLocation = jobDetail.DetailLocation;
                d.Price = jobDetail.Price;
                d.CreatedAt = j.CreatedDate;
                d.Status = j.Status;
                d.JobID = j.JobID;
                d.JobType = j.JobType;
                display.Add(d);
            }

            return Ok(display);
        }

        [HttpGet("GetJobsByAccountID")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsByAccountID([FromQuery] int accountId, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(accountId);
            if (fa == null)
            {
                Message = "Không tìm thấy tài khoản gia đình!";
                return NotFound(Message);
            }
            var jobs = await _jobService.GetJobsByAccountIDAsync(fa.FamilyID, pageNumber, pageSize);
            if (jobs == null || !jobs.Any())
            {
                Message = "Gia đình chưa đăng công việc nào";
                return NotFound(Message);
            }

            var display = new List<JobDisplayDTO>();
            foreach (var j in jobs)
            {
                var d = new JobDisplayDTO();
                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(j.JobID);
                d.JobName = j.JobName;
                d.FamilyID = j.FamilyID;
                d.Location = jobDetail.Location;
                d.DetailLocation = jobDetail.DetailLocation;
                d.Price = jobDetail.Price;
                d.CreatedAt = j.CreatedDate;
                d.Status = j.Status;
                d.JobID = j.JobID;
                d.JobType = j.JobType;
                display.Add(d);
            }

            return Ok(display);
        }

        [HttpPost("AddJob")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult> AddJob([FromQuery] JobCreateDTO jobCreateDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest("Dữ liệu công việc không phù hợp!");

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            if (jobCreateDTO.IsOffered)
            {
                if (!jobCreateDTO.HousekeeperID.HasValue)
                    return BadRequest("Phải có thông tin của người giúp việc nếu được cộng việc offer!");

                foreach (var slotID in jobCreateDTO.SlotIDs)
                {
                    foreach (var day in jobCreateDTO.DayofWeek)
                    {
                        bool isSlotBooked = await _bookingSlotsService.IsSlotBooked(
                            jobCreateDTO.HousekeeperID.Value,
                            slotID,
                            day,
                            jobCreateDTO.StartDate,
                            jobCreateDTO.EndDate
                        );

                        if (isSlotBooked)
                        {
                            return Conflict($"Slot {slotID} for day {day} is already booked for this housekeeper in the selected date range.");
                        }
                    }
                }
            }

            // Calculate the total price of selected services
            decimal totalServicePrice = 0;
            foreach (var serviceID in jobCreateDTO.ServiceIDs)
            {
                var service = await _serviceService.GetServiceByIDAsync(serviceID);
                if (service == null)
                    return BadRequest($"Dịch vụ với mã {serviceID} không tìm thấy!.");
                totalServicePrice += service.Price;
            }

            // ✅ Calculate the average price per hour
            decimal pricePerHour = totalServicePrice / jobCreateDTO.ServiceIDs.Count;

            // Calculate total number of weeks and slots
            /*TimeSpan dateRange = jobCreateDTO.EndDate.Date - jobCreateDTO.StartDate.Date;
            int numberOfWeeks = (int)Math.Ceiling(dateRange.TotalDays / 7.0);
            int slotsPerWeek = jobCreateDTO.SlotIDs.Count * jobCreateDTO.DayofWeek.Count;
            int totalSlots = slotsPerWeek * numberOfWeeks;*/
            var startDate = jobCreateDTO.StartDate.Date;
            var endDate = jobCreateDTO.EndDate.Date;
            var selectedDays = jobCreateDTO.DayofWeek; // e.g., [1, 3, 5] for Mon/Wed/Fri
            var slotsPerDay = jobCreateDTO.SlotIDs.Count;

            int totalSlots = 0;

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                if (selectedDays.Contains((int)date.DayOfWeek)) // DayOfWeek enum: Sunday = 0, Monday = 1, ...
                {
                    totalSlots += slotsPerDay;
                }
            }

            // ✅ Calculate total job price
            decimal totalJobPrice = pricePerHour * totalSlots;

            // ✅ Determine PlatformFee ID by JobType
            int platformFeeID;
            if (jobCreateDTO.JobType == 1)
                platformFeeID = 1;
            else if (jobCreateDTO.JobType == 2)
                platformFeeID = 2;
            else
                return BadRequest("Loại công việc không phù hợp");

            // ✅ Fetch fee percent from DB
            var platformFeeRecord = await _platformFeeService.GetPlatformFeeByIDAsync(platformFeeID);
            if (platformFeeRecord == null)
                return StatusCode(500, $"Phí nền tảng với mã ID {platformFeeID} không tìm thấy!.");

            decimal feePercent = platformFeeRecord.Percent;

            // ✅ Final fee/charge calculation
            decimal platformFee = totalJobPrice * feePercent;
            decimal chargeAmount = totalJobPrice + platformFee;
            decimal housekeeperEarnings = totalJobPrice;

            // Wallet and balance check
            var acc = await _familyProfileService.GetFamilyByIDAsync(jobCreateDTO.FamilyID);
            if (acc == null) return NotFound("Không tìm thấy thông tin gia đình!");

            var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);
            if (wallet == null) return NotFound("Không tìm thấy ví người dùng!");

            if (wallet.Balance < chargeAmount)
            {
                return BadRequest(new
                {
                    message = "Không đủ số dư để tạo công việc!",
                    requiredAmount = chargeAmount,
                    currentBalance = wallet.Balance,
                    topUpNeeded = chargeAmount - wallet.Balance
                });
            }

            // Deduct wallet
            wallet.Balance -= chargeAmount;
            wallet.UpdatedAt = vietnamTime;
            await _walletService.UpdateWalletAsync(wallet);

            // Add transaction: payment from family
            var transactionId = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
            await _transactionService.AddTransactionAsync(new Transaction
            {
                TransactionID = transactionId,
                WalletID = wallet.WalletID,
                AccountID = acc.AccountID,
                Amount = chargeAmount,
                Fee = platformFee,
                CreatedDate = vietnamTime,
                Description = "Thanh toán cho tạo công việc",
                UpdatedDate = vietnamTime,
                TransactionType = (int)TransactionType.Payment,
                Status = (int)TransactionStatus.Completed,
            });

            // Create job
            var job = _mapper.Map<Job>(jobCreateDTO);
            job.Status = (int)JobStatus.Pending;
            await _jobService.AddJobAsync(job);

            // Create job detail
            var jobDetail = _mapper.Map<JobDetail>(jobCreateDTO);
            jobDetail.JobID = job.JobID;
            jobDetail.Price = totalJobPrice;
            jobDetail.PricePerHour = pricePerHour;
            jobDetail.FeeID = platformFeeID; // ✅ Save the fee ID used
            await _jobService.AddJobDetailAsync(jobDetail);

            // Create payment record
            var payment = new Payment
            {
                FamilyID = acc.FamilyID,
                PaymentDate = vietnamTime,
                Amount = chargeAmount,
                Commission = platformFee,
                JobID = job.JobID,
                Status = (int)PaymentStatus.Pending
            };
            await _paymentService.AddPaymentAsync(payment);

            // Add job services
            foreach (var serviceID in jobCreateDTO.ServiceIDs)
            {
                await _jobServiceService.AddJob_ServiceAsync(new Job_Service
                {
                    JobID = job.JobID,
                    ServiceID = serviceID
                });
            }

            // Add job slots
            foreach (var slotID in jobCreateDTO.SlotIDs)
            {
                foreach (var day in jobCreateDTO.DayofWeek)
                {
                    await _jobSlotsService.AddJob_SlotsAsync(new Job_Slots
                    {
                        JobID = job.JobID,
                        SlotID = slotID,
                        DayOfWeek = day
                    });
                }
            }

            return Ok("Tạo công việc thành công!");
        }

        /*
                private DateTime GetNextDayOfWeek(DateTime startDate, int dayOfWeek)
                {
                    int daysUntilNext = ((dayOfWeek - (int)startDate.DayOfWeek + 7) % 7);
                    return startDate.AddDays(daysUntilNext == 0 ? 7 : daysUntilNext);
                }*/

        // Accept the job and create the booking and booking slots if conditions are met
        [HttpPost("AcceptJob")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult> AcceptJob([FromQuery] int jobId, int accountID)
        {
            if (jobId <= 0)
            {
                return BadRequest("Mã ID công việc không phù hợp!");
            }

            try
            {
                DateTime utcNow = DateTime.UtcNow;

                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

                DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
                if (hk == null)
                {
                    return NotFound("Không tìm thấy người giúp việc!");
                }

                var job = await _jobService.GetJobByIDAsync(jobId);
                if (job == null)
                {
                    return NotFound("Không tìm thấy công việc!");
                }

                if (job.Status == 3)
                {
                    return BadRequest("Công việc này đã được ứng tuyển rồi!");
                }

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
                if (jobDetail == null)
                {
                    return NotFound("Không tìm thấy chi tiết công việc!");
                }

                if (jobDetail.HousekeeperID == null)
                {
                    jobDetail.HousekeeperID = hk.HousekeeperID;
                }

                if (jobDetail.EndDate < vietnamTime)
                {
                    Message = "Cộng việc đã quá hạn, không thể nhận công việc!";
                    return Conflict(Message);
                }

                var applications = await _applicationService.GetAllApplicationsByJobIDAsync(job.JobID);
                if (applications.Count == 0 && !jobDetail.IsOffered)
                {
                    Message = "Chưa có đơn ứng tuyển nào cho công việc này!";
                    return NotFound(Message);
                }
                foreach (var item in applications)
                {
                    if (item.HouseKeeperID != hk.HousekeeperID)
                    {
                        var app = new Application();
                        app.ApplicationID = item.ApplicationID;
                        app.Status = (int)ApplicationStatus.Denied;
                        app.HouseKeeperID = item.HouseKeeperID;
                        app.JobID = item.JobID;

                        var noti = new Notification();
                        noti.Message = "Đơn ứng tuyển của bạn cho công việc #" + job.JobID + " - " + job.JobName + " đã bị từ chối!";
                        noti.AccountID = item.HouseKepper.AccountID;

                        await _notificationService.AddNotificationAsync(noti);
                        await _applicationService.UpdateApplicationAsync(app);
                    }
                }

                var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(job.JobID);
                if (jobSlots == null || !jobSlots.Any())
                {
                    return BadRequest("Không tìm thấy slot làm việc của công việc!");
                }

                // 🔒 Check for conflicting bookings
                foreach (var slot in jobSlots)
                {
                    bool isSlotBooked = await _bookingSlotsService.IsSlotBooked(
                        jobDetail.HousekeeperID.Value,
                        slot.SlotID,
                        slot.DayOfWeek,
                        jobDetail.StartDate,
                        jobDetail.EndDate
                    );

                    if (isSlotBooked)
                    {
                        job.Status = 2;
                        await _jobService.UpdateJobAsync(job);
                        return Conflict($"Slot {slot.SlotID} vào ngày {slot.DayOfWeek} bị bận!");
                    }
                }

                // ✅ Accept job
                job.Status = (int)JobStatus.Accepted;
                await _jobService.UpdateJobAsync(job);

                // 📅 Create Booking
                var newBooking = new BusinessObject.Models.Booking
                {
                    JobID = jobId,
                    HousekeeperID = jobDetail.HousekeeperID.Value,
                    CreatedAt = vietnamTime,
                    Status = (int)BookingStatus.Accepted
                };

                await _bookingService.AddBookingAsync(newBooking);

                // 📆 Add Booking Slots with accurate calendar dates
                DateTime currentDate = jobDetail.StartDate;
                while (currentDate <= jobDetail.EndDate)
                {
                    foreach (var slot in jobSlots)
                    {
                        if ((int)currentDate.DayOfWeek == slot.DayOfWeek)
                        {
                            var bookingSlot = new Booking_Slots
                            {
                                BookingID = newBooking.BookingID,
                                SlotID = slot.SlotID,
                                DayOfWeek = slot.DayOfWeek,
                                Date = currentDate
                            };

                            await _bookingSlotsService.AddBooking_SlotsAsync(bookingSlot);
                        }
                    }

                    currentDate = currentDate.AddDays(1); // Check next day
                }

                // 🔔 Send notification
                var notification = new Notification
                {
                    AccountID = job.Family.AccountID,
                    Message = $"Công việc của bạn '{job.JobName}' đã được chấp nhận bởi người giúp việc.",
                    CreatedDate = vietnamTime,
                    IsRead = false
                };

                await _notificationService.AddNotificationAsync(notification);

                return Ok("Đã chấp nhận công việc!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AcceptJob: {ex.Message}");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        [HttpPut("DenyJob")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult> DenyJob([FromQuery] int jobId, int accountID)
        {
            if (jobId <= 0)
            {
                return BadRequest("Mã ID công việc không hợp lệ!");
            }

            try
            {
                DateTime utcNow = DateTime.UtcNow;

                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

                DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
                if (hk == null)
                {
                    return NotFound("Không tìm thấy thông tin người giúp việc!");
                }

                var job = await _jobService.GetJobByIDAsync(jobId);
                if (job == null)
                {
                    return NotFound("Không tìm thấy thông tin công việc!");
                }

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
                if (jobDetail == null)
                {
                    return NotFound("Không tìm thấy chi tiết công việc!");
                }

                if (jobDetail.HousekeeperID != hk.HousekeeperID)
                {
                    Message = "Bạn không có quyền để từ chối công việc này!";
                    return Conflict(Message);
                }

                // Update status and remove HousekeeperID
                job.Status = (int)JobStatus.Verified;
                await _jobService.UpdateJobAsync(job);

                jobDetail.HousekeeperID = null;
                await _jobService.UpdateJobDetailAsync(jobDetail);

                // Send notification to the Family/Account who posted the job
                var notification = new Notification
                {
                    AccountID = job.Family.AccountID, // Or use job.AccountID depending on your model
                    Message = $"Công việc của bạn '{job.JobName}' đã bị từ chối bởi người giúp việc.",
                    CreatedDate = vietnamTime,
                    IsRead = false
                };

                await _notificationService.AddNotificationAsync(notification);

                return Ok("Từ chối công việc thành công, gia đình đã được thông báo!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DenyJob: {ex.Message}");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        [HttpPut("UpdateJob")]
        [Authorize]
        public async Task<ActionResult> UpdateJob([FromQuery] JobUpdateDTO jobUpdateDTO)
        {
            var job = await _jobService.GetJobByIDAsync(jobUpdateDTO.JobID);
            if (job == null)
            {
                Message = "Không có thông tin công việc!";
                return NotFound(Message);
            }

            job.JobName = jobUpdateDTO.JobName;

            await _jobService.UpdateJobAsync(job);
            var detail = _mapper.Map<JobDetail>(jobUpdateDTO);
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobUpdateDTO.JobID);
            if (jobDetail == null)
            {
                Message = "Không có thông tin chi tiết công việc!";
                return NotFound(Message);
            }
            detail.JobDetailID = jobDetail.JobDetailID;
            await _jobService.UpdateJobDetailAsync(detail);

            Message = "Cập nhật công việc thành công!";
            return Ok(Message);
        }

        [HttpPost("ForceAbandonJobAndReassign")]
        [Authorize]
        public async Task<ActionResult> ForceAbandonJobAndReassign([FromQuery] int jobId, [FromQuery] int accountID)
        {
            var oldJob = await _jobService.GetJobByIDAsync(jobId);
            if (oldJob == null)
                return NotFound("Không tìm thấy thông tin công việc!");
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
            if (jobDetail == null)
                return NotFound("Không tìm thấy thông tin chi tiết công việc!");

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var abandonDate = vietnamTime.Date;
            var acc = await _accountService.GetAccountByIDAsync(accountID);
            var hk = new Housekeeper();

            if (acc.RoleID == 1)
            {
                hk = await _houseKeeperService.GetHousekeeperByUserAsync(acc.AccountID);
                if (hk == null)
                    return NotFound("Không tìm thấy thông tin người giúp việc!");

                if (jobDetail.HousekeeperID != hk.HousekeeperID)
                    return Conflict("Bạn không phải người giúp việc được chỉ định cho công việc!");
            }
            else if (acc.RoleID != 3)
            {
                return Conflict("Bạn không có quyền truy cập!");
            }

            if (jobDetail.HousekeeperID == null)
                return BadRequest("Công việc chưa có người giúp việc nào được ứng tuyển!");

            var booking = await _bookingService.GetBookingByJobIDAsync(oldJob.JobID);
            var allSlots = new List<Booking_Slots>();

            var slots = await _bookingSlotsService.GetBooking_SlotsByBookingIDAsync(booking.BookingID);
            allSlots.AddRange(slots);

            var countAfterAbandonDate = allSlots
                .Where(s => s.Date >= abandonDate && (s.IsConfirmedByFamily || s.IsCheckedIn == false) && s.Status == BookingSlotStatus.Active)
                .Select(s => new Booking_Slots
                {
                    SlotID = s.SlotID,
                    DayOfWeek = s.DayOfWeek,
                    Date = s.Date
                })
                .ToList(); // Save to reassign
            // Count slots before abandonDate
            var countBeforeAbandonDate = allSlots
                .Count(s => s.Date < abandonDate &&
                            (!s.IsConfirmedByFamily || !s.IsCheckedIn) &&
                            s.Status == BookingSlotStatus.Active);

            // Total count

            if (countAfterAbandonDate.Count == 0)
            {
                Message = "Tất cả các slot đã hoàn thành, không thể hủy công việc!";
                return NotFound(Message);
            }
            // Cancel all booking slots
            foreach (var slot in allSlots)
            {
                slot.Status = BookingSlotStatus.Canceled;
                await _bookingSlotsService.UpdateBooking_SlotAsync(slot);
            }

            // Cancel old bookings
            booking.Status = (int)BookingStatus.Canceled;
            await _bookingService.UpdateBookingAsync(booking);

            // payout calculation
            var totalUnworkedSlots = countAfterAbandonDate.Count + countBeforeAbandonDate;
            decimal unworkAmount = totalUnworkedSlots * jobDetail.PricePerHour;
            decimal payoutAmount = jobDetail.Price - unworkAmount;
            decimal newJobPrice = countAfterAbandonDate.Count * jobDetail.PricePerHour;

            var family = await _familyProfileService.GetFamilyByIDAsync(oldJob.FamilyID);
            /*var familyWallet = await _walletService.GetWalletByUserAsync(family.AccountID);*/

            /*if (familyWallet == null || hkWallet == null)
                return NotFound("Không tìm thấy thông tin ví người dùng!");

            familyWallet.Balance += refundAmount;
            familyWallet.UpdatedAt = vietnamTime;
            await _walletService.UpdateWalletAsync(familyWallet);*/

            /*await _transactionService.AddTransactionAsync(new Transaction
            {
                TransactionID = int.Parse(DateTimeOffset.Now.ToString("ffffff")),
                WalletID = familyWallet.WalletID,
                AccountID = family.AccountID,
                Amount = refundAmount,
                Fee = 0,
                CreatedDate = vietnamTime,
                Description = $"Hoàn tiền cho những ngày chưa làm của công việc #{jobId}",
                UpdatedDate = vietnamTime,
                TransactionType = (int)TransactionType.Refund,
                Status = (int)TransactionStatus.Completed
            });*/

            var hkAccountId = jobDetail.HousekeeperID;
            var hkWallet = await _walletService.GetWalletByUserAsync(hk.AccountID);

            hkWallet.Balance += payoutAmount;
            hkWallet.UpdatedAt = vietnamTime;
            await _walletService.UpdateWalletAsync(hkWallet);

            var payout = new Payout();
            payout.PayoutDate = null;
            payout.Status = (int)PayoutStatus.Completed;
            payout.BookingID = booking.BookingID;
            payout.Amount = payoutAmount;
            payout.HousekeeperID = hk.HousekeeperID;

            await _payoutService.AddPayoutAsync(payout);


            await _transactionService.AddTransactionAsync(new Transaction
            {
                TransactionID = int.Parse(DateTimeOffset.Now.ToString("ffffff")) + 1,
                WalletID = hkWallet.WalletID,
                AccountID = hk.AccountID,
                Amount = payoutAmount,
                Fee = 0,
                CreatedDate = vietnamTime,
                Description = $"Lương cho những ngày đã làm của công việc #{jobId}",
                UpdatedDate = vietnamTime,
                TransactionType = (int)TransactionType.Payout,
                Status = (int)TransactionStatus.Completed
            });

            var oldJobDetail = await _jobService.GetJobDetailByJobIDAsync(oldJob.JobID);

            oldJobDetail.EndDate = abandonDate;
            oldJob.Status = (int)(hk.HousekeeperID == jobDetail.HousekeeperID ? JobStatus.HousekeeperQuitJob : JobStatus.Canceled);
            await _jobService.UpdateJobAsync(oldJob);
            await _jobService.UpdateJobDetailAsync(oldJobDetail);

            // Tạo lại job mới dựa vào thông tin job cũ với thời hạn còn lại
            var newJob = new Job
            {
                FamilyID = oldJob.FamilyID,
                JobName = oldJob.JobName,
                JobType = oldJob.JobType,
                Status = (int)JobStatus.ReAssignedJob,
                CreatedDate = vietnamTime,
                UpdatedDate = vietnamTime
            };
            await _jobService.AddJobAsync(newJob);
            var newJobDetail = new JobDetail();

            newJobDetail.JobID = newJob.JobID;
            newJobDetail.Location = jobDetail.Location;
            newJobDetail.Price = newJobPrice;
            newJobDetail.FeeID = jobDetail.FeeID;
            newJobDetail.DetailLocation = jobDetail.DetailLocation;
            newJobDetail.PricePerHour = jobDetail.PricePerHour;
            newJobDetail.StartDate = countAfterAbandonDate.Min(s => s.Date.Value);
            newJobDetail.EndDate = jobDetail.EndDate;
            newJobDetail.Description = jobDetail.Description;
            newJobDetail.IsOffered = false;
            newJobDetail.HousekeeperID = null;

            await _jobService.AddJobDetailAsync(newJobDetail);

            var oldServices = await _jobServiceService.GetJob_ServicesByJobIDAsync(oldJob.JobID);
            foreach (var service in oldServices)
            {
                await _jobServiceService.AddJob_ServiceAsync(new Job_Service
                {
                    JobID = newJob.JobID,
                    ServiceID = service.ServiceID
                });
            }
            var newJobSlots = new List<Job_Slots>();
            var oldJobSLots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(oldJob.JobID);
            if (oldJobSLots.Count == 0)
            {
                Message = "Không tìm thấy danh sách slot làm việc của công việc!";
                return NotFound(Message);
            }

            foreach (var oldSlots in oldJobSLots)
            {
                await _jobSlotsService.AddJob_SlotsAsync(new Job_Slots
                {
                    JobID = newJob.JobID,
                    DayOfWeek = oldSlots.DayOfWeek,
                    SlotID = oldSlots.SlotID,
                });
            }

            var noti = new Notification();
            noti.AccountID = family.AccountID;
            noti.Message = "Công việc #" + oldJob.JobID + " - " + oldJob.JobName + " đã bị người giúp việc bỏ!\n " +
                "Công việc tương ứng với thời gian còn lại đã được tạo!";

            await _notificationService.AddNotificationAsync(noti);

            return Ok(new
            {
                message = "Đã hủy bỏ công việc thành công! Công việc mới tương tự với thời hạn còn lại đã được tạo!",
                oldJobId = oldJob.JobID,
                newJobId = newJob.JobID,
                payoutToHK = payoutAmount,
                newPrice = newJobPrice
            });
        }

        [HttpPut("DeleteJobAndRefund")]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> DeleteJobRefund([FromQuery] int jobId)
        {
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
            {
                Message = "không tìm thấy công việc!";
                return NotFound(Message);
            }

            if (job.Status != (int)JobStatus.Verified && job.Status != (int)JobStatus.ReAssignedJob)
            {
                Message = "Công việc đang trong trạng thái không thể xóa!";
                return Conflict(Message);
            }

            // Update and save
            job.Status = (int)JobStatus.Canceled;
            await _jobService.UpdateJobAsync(job);

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
            if (jobDetail == null)
            {
                Message = "Không tìm thấy chi tiết công việc!";
                return NotFound(Message);
            }

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var wallet = await _walletService.GetWalletByUserAsync(job.Family.AccountID);
            if (wallet == null)
            {
                Message = "Không tìm thấy thông tin ví của người dùng!";
                return NotFound(Message);
            }

            wallet.Balance += jobDetail.Price;
            wallet.UpdatedAt = vietnamTime;

            await _walletService.UpdateWalletAsync(wallet);

            var transactionId = int.Parse(DateTimeOffset.Now.ToString("ffffff"));

            var trans = new Transaction();

            trans.TransactionID = transactionId;
            trans.TransactionType = (int)TransactionType.Refund;
            trans.AccountID = job.Family.AccountID;
            trans.Status = (int)TransactionStatus.Completed;
            trans.CreatedDate = vietnamTime;
            trans.UpdatedDate = vietnamTime;
            trans.Fee = 0;
            trans.Amount = jobDetail.Price;
            trans.Description = "Hủy công việc!";
            trans.WalletID = wallet.WalletID;

            await _transactionService.AddTransactionAsync(trans);

            var noti = new Notification();
            noti.Message = "Công việc #" + job.JobID + " - " + job.JobName + " đã được hủy, tiền đã được hoàn về ví của bạn!";
            noti.AccountID = job.Family.AccountID;

            await _notificationService.AddNotificationAsync(noti);
            Message = "Hủy công việc và hoàn tiền thành công!";
            return Ok(Message);
        }

        [HttpGet("SuggestAvailableHousekeepers")]
        [Authorize]
        public async Task<IActionResult> SuggestAvailableHousekeepers([FromQuery] int jobId)
        {
            var job = await _jobService.GetJobByIDAsync(jobId);
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
            var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(jobId);

            if (job == null || jobDetail == null || !jobSlots.Any())
                return BadRequest("Thông tin chi tiết công việc không phù hợp!");

            var allHousekeepers = await _houseKeeperService.GetAllHousekeepersAsync(1, 1000);
            var availableHKs = new List<Housekeeper>();

            foreach (var hk in allHousekeepers)
            {
                bool hasConflict = false;

                foreach (var slot in jobSlots)
                {
                    if (await _bookingSlotsService.IsSlotBooked(
                        hk.HousekeeperID,
                        slot.SlotID,
                        slot.DayOfWeek,
                        jobDetail.StartDate,
                        jobDetail.EndDate))
                    {
                        hasConflict = true;
                        break;
                    }
                }

                if (!hasConflict)
                    availableHKs.Add(hk);
            }

            //Map to DTOs
            var result = availableHKs.Select(h => new HousekeeperListDTO
            {
                HousekeeperID = h.HousekeeperID,
                Nickname = h.Account.Nickname,
                Address = h.Account.Address,
                Phone = h.Account.Phone,
                Email = h.Account.Email,
                Gender = h.Account.Gender ?? 0,
                WorkType = h.WorkType,
                Rating = h.Rating,
                LocalProfilePicture = h.Account.LocalProfilePicture
            });

            return Ok(result);
        }

        [HttpPut("OfferJob")]
        [Authorize]
        public async Task<ActionResult> OfferJob([FromQuery] int jobId, [FromQuery] int housekeeperId)
        {
            if (jobId <= 0 || housekeeperId <= 0)
            {
                return BadRequest("Mã ID công việc hoặc người giúp việc không phù hợp!");
            }

            // Get the job and job detail
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
            {
                return NotFound("Không tìm thấy thông tin công việc!");
            }

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
            if (jobDetail == null)
            {
                return NotFound("Không tìm thấy thông tin chi tiết công việc!");
            }

            // Get job slots
            var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(jobId);
            if (jobSlots == null || !jobSlots.Any())
            {
                return NotFound("Công việc không có slot làm việc nào!");
            }

            // Check if any of the slots conflict with the housekeeper's existing bookings
            foreach (var slot in jobSlots)
            {
                bool isSlotBooked = await _bookingSlotsService.IsSlotBooked(
                    housekeeperId,
                    slot.SlotID,
                    slot.DayOfWeek,
                    jobDetail.StartDate,
                    jobDetail.EndDate
                );

                if (isSlotBooked)
                {
                    return Conflict($"Slot {slot.SlotID} vào ngày {slot.DayOfWeek} của người giúp việc bị bận trong thời gian được chọn!.");
                }
            }

            // No conflicts — offer the job
            jobDetail.HousekeeperID = housekeeperId;
            jobDetail.IsOffered = true;

            //Send notification to HK
            var hk = await _houseKeeperService.GetHousekeeperByIDAsync(housekeeperId);
            if (hk == null)
            {
                Message = "Không tìm tháy thông tin người giúp việc!";
                return NotFound(Message);
            }

            var noti = new Notification();
            noti.Message = "Công việc #" + job.JobID + " - " + job.JobName + " đã được offer cho bạn!";
            noti.AccountID = hk.AccountID;

            await _notificationService.AddNotificationAsync(noti);

            await _jobService.UpdateJobDetailAsync(jobDetail);

            return Ok("Công việc đã được offer cho người giúp việc!");
        }

        [HttpPut("VerifyJob")]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> VerifyJob([FromQuery] int jobId, [FromQuery] int status)
        {
            // Validate allowed statuses
            if (status != (int)JobStatus.Verified && status != (int)JobStatus.NotPermitted)
            {
                Message = "Chỉ có status Verified(2) và NotPermited(7) là được phép duyệt!";
                return BadRequest(Message);
            }

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
            // Fetch job
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
            {
                Message = "Không tiềm thấy thông tin công việc!";
                return NotFound(Message);
            }

            // Only allow verify if job is still Pending
            if (job.Status != (int)JobStatus.Pending)
            {
                Message = "Chỉ có công việc có status là Verified mới được duyệt!";
                return Conflict(Message);
            }

            // Update and save
            job.Status = status;
            await _jobService.UpdateJobAsync(job);

            Message = status == (int)JobStatus.Verified
                ? "Công việc đã được duyệt thành công!"
                : "Cộng việc này không được duyệt!";
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
            var housekeeper = await _houseKeeperService.GetHousekeeperByIDAsync(jobDetail.HousekeeperID.GetValueOrDefault());
            if (housekeeper != null)
            {
                await _notificationService.AddNotificationAsync(new Notification
                {
                    AccountID = housekeeper.AccountID,
                    Message = status == (int)JobStatus.Verified
            ? "Một công việc bạn được đề xuất đã được xác minh. Vui lòng kiểm tra chi tiết công việc."
            : "Một công việc bạn được đề xuất đã bị từ chối.",
                    RedirectUrl = null,
                    IsRead = false,
                    CreatedDate = vietnamTime
                });
            }

            var noti = new Notification();
            noti.Message = "Công việc #" + job.JobID + " - " + job.JobName + " đã được phê duyệt!";
            noti.AccountID = job.Family.AccountID;

            await _notificationService.AddNotificationAsync(noti);

            return Ok(Message);
        }

        [HttpDelete("DeleteJob")]
        [Authorize]
        public async Task<ActionResult> DeleteJob([FromQuery] int id)
        {
            var job = await _jobService.GetJobByIDAsync(id);
            if (job == null)
            {
                Message = "Job not found!";
                return NotFound(Message);
            }

            // Set status to Canceled
            job.Status = (int)JobStatus.Canceled;
            await _jobService.UpdateJobAsync(job);

            Message = "Job has been canceled successfully!";
            return Ok(Message);
        }

        [HttpPost("CancelJob")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult> CancelJob([FromQuery] int jobId, [FromQuery] int accountId)
        {
            try
            {
                DateTime utcNow = DateTime.UtcNow;

                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

                DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                var job = await _jobService.GetJobByIDAsync(jobId);
                if (job == null)
                    return NotFound("Thông tìm thấy thông tin công việc!");

                // ⛔️ Prevent canceling completed jobs
                if (job.Status == (int)JobStatus.Completed)
                    return BadRequest("Không thể hủy công việc có status Completed!");

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
                if (jobDetail == null)
                    return NotFound("Không tìm thấy thông tin chi tiết công việc!");

                var family = await _familyProfileService.GetFamilyByIDAsync(job.FamilyID);
                if (family == null)
                    return NotFound("Không tìm thấy thông tin gia đình!");

                bool isFamily = family.AccountID == accountId;
                bool isHousekeeper = jobDetail.Housekeeper.AccountID == accountId;

                if (!isFamily && !isHousekeeper)
                    return Conflict("Bạn không có quyền để hủy công việc này!");

                bool isAccepted = job.Status == (int)JobStatus.Accepted;

                // Cancel job
                job.Status = (int)JobStatus.Canceled;
                job.UpdatedDate = vietnamTime;
                await _jobService.UpdateJobAsync(job);

                // Cancel related bookings if job was accepted
                if (isAccepted)
                {
                    var bookings = await _bookingService.GetBookingsByJobIDAsync(jobId);
                    foreach (var booking in bookings)
                    {
                        booking.Status = (int)BookingStatus.Canceled;
                        await _bookingService.UpdateBookingAsync(booking);
                    }
                }

                // Send notifications
                if (jobDetail.HousekeeperID.HasValue)
                {
                    var housekeeper = await _houseKeeperService.GetHousekeeperByIDAsync(jobDetail.HousekeeperID.Value);
                    if (housekeeper == null)
                        return NotFound("Không tìm thấy thông tin người giúp việc!");

                    int housekeeperAccountId = housekeeper.AccountID;

                    if (isFamily)
                    {
                        await _notificationService.AddNotificationAsync(new Notification
                        {
                            AccountID = housekeeperAccountId,
                            Message = "Cộng việc bạn được offer đã bị hủy!",
                            RedirectUrl = null,
                            IsRead = false,
                            CreatedDate = vietnamTime
                        });
                    }
                    else if (isHousekeeper)
                    {
                        await _notificationService.AddNotificationAsync(new Notification
                        {
                            AccountID = family.AccountID,
                            Message = "Người giúp việc đã hủy việc!",
                            RedirectUrl = null,
                            IsRead = false,
                            CreatedDate = vietnamTime
                        });
                    }
                }

                return Ok("Hủy công việc thành công!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Cancel Job Error: {ex.Message}");
                return StatusCode(500, "Internal Server Error.");
            }
        }

        [HttpPost("CheckIn")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<ActionResult> CheckIn([FromQuery] int bookingId)
        {
            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var today = vietnamTime.Date;

            // ✅ Retrieve all booking slots for this booking and today's date
            var todaySlots = await _bookingSlotsService.GetBookingSlotsByDateAndBookingIDAsync(bookingId, today);
            if (todaySlots == null || !todaySlots.Any())
                return NotFound("Không tìm thấy slot làm việc hôm nay!");

            // 🚫 Check if all slots are already checked in
            if (todaySlots.All(s => s.IsCheckedIn))
                return BadRequest("Bạn đã check-on tất cả slot của ngày hốm nay!");

            // 🔁 Loop through and mark each slot as checked in
            foreach (var slot in todaySlots)
            {
                if (!slot.IsCheckedIn)
                {
                    slot.IsCheckedIn = true;
                    slot.CheckInTime = vietnamTime;
                    await _bookingSlotsService.UpdateBooking_SlotAsync(slot);
                }
            }

            return Ok("Đã check-in thành công cho tất cả slot ngày hôm nay!");
        }

        [HttpPost("ConfirmSlotWorked")]
        [Authorize(Policy = "Family")]
        public async Task<IActionResult> ConfirmSlotWorked([FromQuery] int bookingId)
        {
            // 🔍 Get today's date
            DateTime utcNow = DateTime.UtcNow;

            // Define the Vietnam time zone (UTC+7)
            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            // Convert UTC time to Vietnam time
            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var today = vietnamTime.Date;

            // 🔍 Get today's booking slots for this booking
            var todaySlots = await _bookingSlotsService.GetBookingSlotsByDateAndBookingIDAsync(bookingId, today);
            if (todaySlots == null || !todaySlots.Any())
                return NotFound("Không có slot nào cho ngày hôm nay!");

            // 🚫 Check if all slots are already confirmed
            if (todaySlots.All(s => s.IsConfirmedByFamily))
                return BadRequest("Bạn đã xác nhận check-in các slot làm việc của người giúp việc hôm nay!");

            // 🔁 Loop through and confirm each slot if eligible
            foreach (var slot in todaySlots)
            {
                if (!slot.IsConfirmedByFamily)
                {
                    if (!slot.IsCheckedIn)
                        return BadRequest($"Người giúp việc chưa check-in cho Slot {slot.SlotID}.");

                    slot.IsConfirmedByFamily = true;
                    slot.ConfirmedAt = vietnamTime;

                    await _bookingSlotsService.UpdateBooking_SlotAsync(slot);
                }
            }

            return Ok("Đã xác nhận check0in ngày hôm nay!");
        }

        [HttpPost("HousekeeperCompleteJob")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<IActionResult> HousekeeperCompleteJob([FromQuery] int jobId, int accountID)
        {
            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if (hk == null)
            {
                Message = "Không tìm thấy người giúp việc!";
                return NotFound(Message);
            }

            // Get the job
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
                return NotFound("Không tìm thấy thông tin người giúp việc!");

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
                return NotFound("Không tìm thấy chi tiết công việc!");

            var fa = await _familyProfileService.GetFamilyByIDAsync(job.FamilyID);
            if (fa == null)
            {
                Message = "Không tìm thấy thông tin gia đình";
                return NotFound(Message);
            }

            if (job.Status != (int)JobStatus.Accepted)
                return BadRequest("Công việc hiện tại chưa thể báo hoàn thành!");

            // Get the booking associated with this job
            var bookings = await _bookingService.GetBookingsByJobIDAsync(jobId);
            if (bookings == null || !bookings.Any())
                return NotFound("Không tìm thấy danh sách công việc đã nhận!");

            // Filter out canceled bookings
            var booking = bookings.FirstOrDefault(b => b.Status != (int)BookingStatus.Canceled);
            if (booking == null)
                return NotFound("No valid (non-canceled) booking found for this job.");

            if (booking.HousekeeperID != hk.HousekeeperID)
                return Unauthorized("Bạn không phải người giúp việc của công việc này!");

            var booking_Slots = await _bookingSlotsService.GetBooking_SlotsByBookingIDAsync(booking.BookingID);
            if (booking_Slots.Count == 0)
            {
                Message = "Danh sách slot công việc đã nhận trống!";
                return NotFound(Message);
            }

            foreach (var slot in booking_Slots)
            {
                slot.Status = BookingSlotStatus.Canceled;
                await _bookingSlotsService.UpdateBooking_SlotAsync(slot);
            }
            //Tạo đơn payout cho HK
            var payout = new Payout();
            payout.PayoutDate = null;
            payout.Status = (int)PayoutStatus.Pending;
            payout.BookingID = booking.BookingID;
            payout.Amount = jobDetail.Price;
            payout.HousekeeperID = hk.HousekeeperID;

            await _payoutService.AddPayoutAsync(payout);

            //Cập tiền vào ví OnHold

            var wallet = await _walletService.GetWalletByIDAsync(hk.AccountID);
            wallet.OnHold += jobDetail.Price;
            wallet.UpdatedAt = vietnamTime;

            await _walletService.UpdateWalletAsync(wallet);

            // Update booking and job status to pending confirmation by family
            booking.Status = (int)BookingStatus.PendingFamilyConfirmation;
            await _bookingService.UpdateBookingAsync(booking);

            job.Status = (int)JobStatus.PendingFamilyConfirmation;
            await _jobService.UpdateJobAsync(job);

            // Send notification to family
            await _notificationService.AddNotificationAsync(new Notification
            {
                AccountID = fa.AccountID,
                Message = $"Người giúp việc đã báo công việc #{job.JobID} đã hoàn thành. Hãy xác nhận.",
                RedirectUrl = $"/jobs/{job.JobID}",
                CreatedDate = vietnamTime
            });

            return Ok("Đã báo hoàn thành công việc, hãy chờ gia đình xác nhận!");
        }

        [HttpPost("ConfirmJobCompletion")]
        [Authorize(Policy = "Family")]
        public async Task<IActionResult> ConfirmJobCompletion([FromQuery] int jobId, int accountID)
        {
            // Get current family user ID from token
            /*var userId = int.Parse(User.FindFirst("UserID").Value);*/
            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(accountID);
            if (fa == null)
            {
                Message = "Không tìm thấy gia đình!";
                return NotFound(Message);
            }
            // Get the job
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
                return NotFound("Không tìm thấy công việc!");

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
                return NotFound("Không tìm thấy công việc chi tiết!");

            if (job.FamilyID != fa.FamilyID)
                return Unauthorized("Bạn không phải người tạo công việc này!");

            if (job.Status != (int)JobStatus.PendingFamilyConfirmation)
                return BadRequest("Công việc đang đợi gia đình xác nhận hoàn thành!");

            // Get the booking for the job
            var booking = await _bookingService.GetBookingByJobIDAsync(jobId);

            if (booking == null)
                return NotFound("Không tìm thấy danh sách công việc đã nhận!");


            if (booking.Status != (int)BookingStatus.PendingFamilyConfirmation)
                return BadRequest("Trạng thái công việc đã nhận chưa chờ gia đình xác nhận!");

            var hk = await _houseKeeperService.GetHousekeeperByIDAsync(booking.HousekeeperID);
            if (hk == null)
            {
                Message = "không tìm thấy tài khoản!";
                return NotFound(Message);
            }

            DateTime utcNow = DateTime.UtcNow;

            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            //Cập nhật tiền vào balance ví HK

            var wallet = await _walletService.GetWalletByUserAsync(hk.AccountID);
            if (wallet == null)
            {
                Message = "Không tìm thấy ví!";
                return NotFound(Message);
            }

            if ((wallet.OnHold - jobDetail.Price) >= 0)
            {
                wallet.Balance += jobDetail.Price;
                wallet.OnHold -= jobDetail.Price;
            }
            wallet.UpdatedAt = vietnamTime;
            await _walletService.UpdateWalletAsync(wallet);

            //Update payout

            var payout = await _payoutService.GetPayoutByJobIDAsync(job.JobID);
            if (payout == null)
            {
                Message = "Không tìm thấy hóa đơn tiền lương!";
                return NotFound(Message);
            }
            payout.Status = (int)PayoutStatus.Completed;
            payout.PayoutDate = vietnamTime;

            await _payoutService.UpdatePayoutAsync(payout);

            //Tạo transaction chio Payout HK
            var transactionId = int.Parse(DateTimeOffset.Now.ToString("ffffff"));

            var trans = new Transaction();

            trans.TransactionID = transactionId;
            trans.TransactionType = (int)TransactionType.Payout;
            trans.AccountID = hk.AccountID;
            trans.Status = (int)TransactionStatus.Completed;
            trans.CreatedDate = vietnamTime;
            trans.UpdatedDate = vietnamTime;
            trans.Fee = 0;
            trans.Amount = jobDetail.Price;
            trans.Description = "Tiền lương công việc.";
            trans.WalletID = wallet.WalletID;

            await _transactionService.AddTransactionAsync(trans);

            // Update statuses to completed
            booking.Status = (int)BookingStatus.Completed;
            await _bookingService.UpdateBookingAsync(booking);

            job.Status = (int)JobStatus.Completed;
            await _jobService.UpdateJobAsync(job);

            //Update JobCompleted count for HK

            hk.JobCompleted++;

            await _houseKeeperService.UpdateHousekeeperAsync(hk);

            // Notify housekeeper
            await _notificationService.AddNotificationAsync(new Notification
            {
                AccountID = hk.AccountID,
                Message = $"Gia định đã xác nhận hoàn thành công việc #{job.JobID}. Chúc mừng!",
                RedirectUrl = $"/jobs/{job.JobID}",
                CreatedDate = vietnamTime
            });

            return Ok("Công việc đã được xác nhận hoàn thành!");
        }
    }
}