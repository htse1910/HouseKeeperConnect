using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Services;
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
        private string Message;
        private readonly IMapper _mapper;

        public JobController(IJobService jobService, IMapper mapper, IJob_ServiceService job_ServiceService, IJob_SlotsService job_SlotsService, IBookingService bookingService, IBooking_SlotsService bookingSlotsService, INotificationService notificationService,
            IFamilyProfileService familyProfileService, IHouseKeeperService houseKeeperService,
            IServiceService serviceService, IAccountService accountService, ITransactionService transactionService, IWalletService walletService, IPaymentService paymentService, IPayoutService payoutService)
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
        }

        [HttpGet("JobList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsAsync([FromQuery] int pageNumber, [FromQuery] int pageSize)
        {
            var jobs = await _jobService.GetAllJobsAsync(pageNumber, pageSize);

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
                d.Price = jobDetail.Price;
                d.CreatedAt = j.CreatedDate;
                d.Status = j.Status;
                d.JobType = j.JobType;
                d.JobID = j.JobID;
                display.Add(d);
            }

            return Ok(display);
        }

        [HttpGet("GetJobByID")]
        [Authorize]
        public async Task<ActionResult<JobDisplayDTO>> GetJobByID([FromQuery] int id)
        {
            var job = await _jobService.GetJobByIDAsync(id);
            if (job == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
            {
                Message = "No records!";
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
                Message = "No records!";
                return NotFound(Message);
            }
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
            {
                Message = "No records!";
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

            displayDTO.SlotIDs = JobSlotDay.Select(slot => slot.SlotID).Distinct().ToList();
            displayDTO.DayofWeek = JobSlotDay.Select(slot => slot.DayOfWeek).Distinct().ToList();
            displayDTO.ServiceIDs = JobService.Select(service => service.ServiceID).Distinct().ToList();

            return Ok(displayDTO);
        }

        [HttpGet("GetJobsByAccountID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsByAccountID([FromQuery] int accountId, [FromQuery] int pageNumber, [FromQuery] int pageSize)
        {

            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(accountId);
            if (fa == null)
            {
                Message = "No account found";
                return NotFound(Message);
            }
            var jobs = await _jobService.GetJobsByAccountIDAsync(fa.FamilyID, pageNumber, pageSize);
            if (jobs == null || !jobs.Any())
            {
                Message = "No records!";
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
        [Authorize]
        public async Task<ActionResult> AddJob([FromQuery] JobCreateDTO jobCreateDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid job data.");

            if (jobCreateDTO.IsOffered)
            {
                if (!jobCreateDTO.HousekeeperID.HasValue)
                    return BadRequest("HousekeeperID is required when IsOffered is true.");

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

            // Calculate price per hour based on selected services
            decimal totalServicePrice = 0;
            foreach (var serviceID in jobCreateDTO.ServiceIDs)
            {
                var service = await _serviceService.GetServiceByIDAsync(serviceID);
                if (service == null)
                    return BadRequest($"Service ID {serviceID} not found.");
                totalServicePrice += service.Price;
            }

            decimal pricePerHour = totalServicePrice;

            TimeSpan dateRange = jobCreateDTO.EndDate.Date - jobCreateDTO.StartDate.Date;
            int numberOfWeeks = (int)Math.Ceiling(dateRange.TotalDays / 7.0);
            int slotsPerWeek = jobCreateDTO.SlotIDs.Count * jobCreateDTO.DayofWeek.Count;
            int totalSlots = slotsPerWeek * numberOfWeeks;

            decimal totalJobPrice = pricePerHour * totalSlots;

            // Determine charge amount based on job type
            decimal chargeAmount = 0;
            if (jobCreateDTO.JobType == 1) // Subscription (charge for 1st week)
            {
                chargeAmount = pricePerHour * jobCreateDTO.SlotIDs.Count * jobCreateDTO.DayofWeek.Count;
            }
            else if (jobCreateDTO.JobType == 2) // One-time
            {
                chargeAmount = totalJobPrice;
            }
            else
            {
                return BadRequest("Invalid job type.");
            }

            // Wallet and balance check
            var acc = await _familyProfileService.GetFamilyByIDAsync(jobCreateDTO.FamilyID);
            if (acc == null) return NotFound("Family account not found.");

            var wallet = await _walletService.GetWalletByUserAsync(acc.AccountID);
            if (wallet == null) return NotFound("Wallet not found.");

            if (wallet.Balance < chargeAmount)
            {
                return BadRequest(new
                {
                    message = "Not enough balance to create the job.",
                    requiredAmount = chargeAmount,
                    currentBalance = wallet.Balance,
                    topUpNeeded = chargeAmount - wallet.Balance
                });
            }

            // Deduct wallet
            wallet.Balance -= chargeAmount;
            wallet.UpdatedAt = DateTime.Now;
            await _walletService.UpdateWalletAsync(wallet);

            // Platform fee and housekeeper earnings
            decimal platformFee = chargeAmount * 0.10m;
            decimal housekeeperEarnings = chargeAmount * 0.90m;

            // Add transaction: payment from family
            var transactionId = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
            await _transactionService.AddTransactionAsync(new Transaction
            {
                TransactionID = transactionId,
                WalletID = wallet.WalletID,
                AccountID = acc.AccountID,
                Amount = chargeAmount,
                Fee = platformFee,
                CreatedDate = DateTime.Now,
                Description = "Payment for job creation",
                UpdatedDate = DateTime.Now,
                TransactionType = (int)TransactionType.Payment,
                Status = (int)TransactionStatus.Completed,
            });

            // (Optional) Add transaction: earnings to housekeeper
            if (jobCreateDTO.HousekeeperID.HasValue)
            {
                var hkwallet = await _walletService.GetWalletByUserAsync(jobCreateDTO.HousekeeperID.Value);
                await _transactionService.AddTransactionAsync(new Transaction
                {
                    TransactionID = transactionId + 1,
                    WalletID = hkwallet.WalletID,
                    AccountID = jobCreateDTO.HousekeeperID.Value,
                    Amount = housekeeperEarnings,
                    Fee = 0,
                    CreatedDate = DateTime.Now,
                    Description = "Earnings reserved from job",
                    UpdatedDate = DateTime.Now,
                    TransactionType = (int)TransactionType.Payout,
                    Status = (int)TransactionStatus.Pending
                });
            }

            // Create job (no Price or PricePerHour in Job)
            var job = _mapper.Map<Job>(jobCreateDTO);
            job.Status = (int)JobStatus.Pending;
            await _jobService.AddJobAsync(job);

            // Create job detail (store Price and PricePerHour here)
            var jobDetail = _mapper.Map<JobDetail>(jobCreateDTO);
            jobDetail.JobID = job.JobID;
            jobDetail.Price = totalJobPrice;
            jobDetail.PricePerHour = pricePerHour;
            await _jobService.AddJobDetailAsync(jobDetail);

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

            return Ok("Job created successfully!");
        }




        /*
                private DateTime GetNextDayOfWeek(DateTime startDate, int dayOfWeek)
                {
                    int daysUntilNext = ((dayOfWeek - (int)startDate.DayOfWeek + 7) % 7);
                    return startDate.AddDays(daysUntilNext == 0 ? 7 : daysUntilNext);
                }*/

        // Accept the job and create the booking and booking slots if conditions are met
        [HttpPost("AcceptJob")]
        [Authorize]
        public async Task<ActionResult> AcceptJob([FromQuery] int jobId, int accountID)
        {
            if (jobId <= 0)
            {
                return BadRequest("Invalid Job ID.");
            }

            try
            {
                var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
                if (hk == null)
                {
                    return NotFound("Housekeeper not found.");
                }

                var job = await _jobService.GetJobByIDAsync(jobId);
                if (job == null)
                {
                    return NotFound("Job not found.");
                }

                if (job.Status == 3)
                {
                    return BadRequest("Job has already been accepted.");
                }

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
                if (jobDetail == null)
                {
                    return NotFound("Job detail not found.");
                }

                if (jobDetail.HousekeeperID == null)
                {
                    jobDetail.HousekeeperID = hk.HousekeeperID;
                }

                var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(job.JobID);
                if (jobSlots == null || !jobSlots.Any())
                {
                    return BadRequest("No slots found for the job.");
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
                        return Conflict($"Slot {slot.SlotID} on day {slot.DayOfWeek} is already booked.");
                    }
                }

                // ✅ Accept job
                job.Status = 3;
                await _jobService.UpdateJobAsync(job);

                // 📅 Create Booking
                var newBooking = new Booking
                {
                    JobID = jobId,
                    HousekeeperID = jobDetail.HousekeeperID.Value,
                    CreatedAt = DateTime.Now,
                    Status = (int)BookingStatus.Pending
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
                    AccountID = job.FamilyID,
                    Message = $"Công việc của bạn '{job.JobName}' đã được chấp nhận bởi người giúp việc.",
                    CreatedDate = DateTime.Now,
                    IsRead = false
                };

                await _notificationService.AddNotificationAsync(notification);

                return Ok("Job accepted, booking and booking slots created successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AcceptJob: {ex.Message}");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        [HttpPut("DenyJob")]
        [Authorize]
        public async Task<ActionResult> DenyJob([FromQuery] int jobId, int accountID)
        {
            if (jobId <= 0)
            {
                return BadRequest("Invalid Job ID.");
            }

            try
            {
                var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
                if (hk == null)
                {
                    return NotFound("Housekeeper not found.");
                }

                var job = await _jobService.GetJobByIDAsync(jobId);
                if (job == null)
                {
                    return NotFound("Job not found.");
                }

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
                if (jobDetail == null)
                {
                    return NotFound("Job detail not found.");
                }

                if (jobDetail.HousekeeperID != hk.HousekeeperID)
                {
                    return Forbid("You are not permitted to deny this job.");
                }

                // Update status and remove HousekeeperID
                job.Status = (int)JobStatus.Verified;
                await _jobService.UpdateJobAsync(job);

                jobDetail.HousekeeperID = null;
                await _jobService.UpdateJobDetailAsync(jobDetail);

                // Send notification to the Family/Account who posted the job
                var notification = new Notification
                {
                    AccountID = job.FamilyID, // Or use job.AccountID depending on your model
                    Message = $"Công việc của bạn '{job.JobName}' đã bị từ chối bởi người giúp việc.",
                    CreatedDate = DateTime.Now,
                    IsRead = false
                };

                await _notificationService.AddNotificationAsync(notification);

                return Ok("Job has been denied and the family has been notified.");
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
                Message = "No records!";
                return NotFound(Message);
            }

            job.JobName = jobUpdateDTO.JobName;

            await _jobService.UpdateJobAsync(job);
            var detail = _mapper.Map<JobDetail>(jobUpdateDTO);
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobUpdateDTO.JobID);
            if (jobDetail == null)
            {
                Message = "No record!";
                return NotFound(Message);
            }
            detail.JobDetailID = jobDetail.JobDetailID;
            await _jobService.UpdateJobDetailAsync(detail);

            Message = "Job updated successfully!";
            return Ok(Message);
        }

        [HttpPut("OfferJob")]
        [Authorize]
        public async Task<ActionResult> OfferJob([FromQuery] int jobId, [FromQuery] int housekeeperId)
        {
            if (jobId <= 0 || housekeeperId <= 0)
            {
                return BadRequest("Invalid job ID or housekeeper ID.");
            }

            // Get the job and job detail
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
            {
                return NotFound("Job not found.");
            }

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
            if (jobDetail == null)
            {
                return NotFound("Job detail not found.");
            }

            // Get job slots
            var jobSlots = await _jobSlotsService.GetJob_SlotsByJobIDAsync(jobId);
            if (jobSlots == null || !jobSlots.Any())
            {
                return BadRequest("Job does not contain any slot data.");
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
                    return Conflict($"Slot {slot.SlotID} on day {slot.DayOfWeek} is already booked for this housekeeper during the selected date range.");
                }
            }

            // No conflicts — offer the job
            jobDetail.HousekeeperID = housekeeperId;
            jobDetail.IsOffered = true;

            await _jobService.UpdateJobDetailAsync(jobDetail);

            return Ok("Job has been offered to the housekeeper successfully.");
        }


        [HttpPut("VerifyJob")]
        [Authorize]
        public async Task<IActionResult> VerifyJob([FromQuery] int jobId, [FromQuery] int status)
        {
            // Validate allowed statuses
            if (status != (int)JobStatus.Verified && status != (int)JobStatus.NotPermitted)
            {
                Message = "Invalid status. Only Verified (2) or NotPermitted (7) are allowed.";
                return BadRequest(Message);
            }

            // Fetch job
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
            {
                Message = "Job not found!";
                return NotFound(Message);
            }

            // Only allow verify if job is still Pending
            if (job.Status != (int)JobStatus.Pending)
            {
                Message = "Only jobs with Pending status can be verified.";
                return StatusCode(StatusCodes.Status403Forbidden, Message);
            }

            // Update and save
            job.Status = status;
            await _jobService.UpdateJobAsync(job);

            Message = status == (int)JobStatus.Verified
                ? "Job verified successfully!"
                : "Job marked as not permitted.";
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
            var housekeeper = await _houseKeeperService.GetHousekeeperByIDAsync(jobDetail.HousekeeperID.Value);
            int housekeeperAccountId = housekeeper.AccountID;
            await _notificationService.AddNotificationAsync(new Notification
            {
                AccountID = housekeeperAccountId,
                Message = status == (int)JobStatus.Verified
            ? "Một công việc bạn được đề xuất đã được xác minh. Vui lòng kiểm tra chi tiết công việc."
            : "Một công việc bạn được đề xuất đã bị từ chối.",
                RedirectUrl = null,
                IsRead = false,
                CreatedDate = DateTime.Now
            });
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
        [Authorize]
        public async Task<ActionResult> CancelJob([FromQuery] int jobId, [FromQuery] int accountId)
        {
            try
            {
                var job = await _jobService.GetJobByIDAsync(jobId);
                if (job == null)
                    return NotFound("Job not found.");

                // ⛔️ Prevent canceling completed jobs
                if (job.Status == (int)JobStatus.Completed)
                    return BadRequest("Cannot cancel a job that is already completed.");

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobId);
                if (jobDetail == null)
                    return NotFound("Job detail not found.");

                var family = await _familyProfileService.GetFamilyByIDAsync(job.FamilyID);
                if (family == null)
                    return NotFound("Family not found.");

                bool isFamily = family.AccountID == accountId;
                bool isHousekeeper = jobDetail.Housekeeper.AccountID == accountId;

                if (!isFamily && !isHousekeeper)
                    return Forbid("You are not authorized to cancel this job.");

                bool isAccepted = job.Status == (int)JobStatus.Accepted;

                // Cancel job
                job.Status = (int)JobStatus.Canceled;
                job.UpdatedDate = DateTime.Now;
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
                        return NotFound("Housekeeper not found.");

                    int housekeeperAccountId = housekeeper.AccountID;

                    if (isFamily)
                    {
                        await _notificationService.AddNotificationAsync(new Notification
                        {
                            AccountID = housekeeperAccountId,
                            Message = "A job you were offered by the family has been canceled.",
                            RedirectUrl = null,
                            IsRead = false,
                            CreatedDate = DateTime.Now
                        });
                    }
                    else if (isHousekeeper)
                    {
                        await _notificationService.AddNotificationAsync(new Notification
                        {
                            AccountID = family.AccountID,
                            Message = "The housekeeper has canceled the job.",
                            RedirectUrl = null,
                            IsRead = false,
                            CreatedDate = DateTime.Now
                        });
                    }
                }

                return Ok("Job canceled successfully.");
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
            // 🔍 Get today's date
            var today = DateTime.Today;

            // ✅ Retrieve all booking slots for this booking and today's date
            var todaySlots = await _bookingSlotsService.GetBookingSlotsByDateAndBookingIDAsync(bookingId, today);
            if (todaySlots == null || !todaySlots.Any())
                return NotFound("No booking slots found for today.");

            // 🚫 Check if all slots are already checked in
            if (todaySlots.All(s => s.IsCheckedIn))
                return BadRequest("You have already checked in for all today's slots.");

            // 🔁 Loop through and mark each slot as checked in
            foreach (var slot in todaySlots)
            {
                if (!slot.IsCheckedIn)
                {
                    slot.IsCheckedIn = true;
                    slot.CheckInTime = DateTime.Now;
                    await _bookingSlotsService.UpdateBooking_SlotAsync(slot);
                }
            }

            return Ok("Checked in successfully for all today's slots.");
        }

        [HttpPost("ConfirmSlotWorked")]
        [Authorize(Policy = "Family")]
        public async Task<IActionResult> ConfirmSlotWorked([FromQuery] int bookingId)
        {
            var today = DateTime.Today;

            // 🔍 Get today's booking slots for this booking
            var todaySlots = await _bookingSlotsService.GetBookingSlotsByDateAndBookingIDAsync(bookingId, today);
            if (todaySlots == null || !todaySlots.Any())
                return NotFound("No booking slots found for today.");

            // 🚫 Check if all slots are already confirmed
            if (todaySlots.All(s => s.IsConfirmedByFamily))
                return BadRequest("All today's slots have already been confirmed.");

            // 🔁 Loop through and confirm each slot if eligible
            foreach (var slot in todaySlots)
            {
                if (!slot.IsConfirmedByFamily)
                {
                    if (!slot.IsCheckedIn)
                        return BadRequest($"Housekeeper did not check in for slot {slot.SlotID}.");

                    slot.IsConfirmedByFamily = true;
                    slot.ConfirmedAt = DateTime.Now;

                    await _bookingSlotsService.UpdateBooking_SlotAsync(slot);
                }
            }

            return Ok("Today's slots confirmed successfully.");
        }


        [HttpPost("HousekeeperCompleteJob")]
        [Authorize(Policy = "Housekeeper")]
        public async Task<IActionResult> HousekeeperCompleteJob([FromQuery] int jobId, int accountID)
        {

            var hk = await _houseKeeperService.GetHousekeeperByUserAsync(accountID);
            if (hk == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }

            // Get the job
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
                return NotFound("Job not found.");
            
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
                return NotFound("JobDetail not found.");

            var fa = await _familyProfileService.GetFamilyByIDAsync(job.FamilyID);
            if(fa == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }

            if (job.Status != (int)JobStatus.Accepted)
                return BadRequest("Job is not in a state that can be marked as completed.");

            // Get the booking associated with this job
            var bookings = await _bookingService.GetBookingsByJobIDAsync(jobId);
            if (bookings == null || !bookings.Any())
                return NotFound("No bookings found for this job.");

            // Filter out canceled bookings
            var booking = bookings.FirstOrDefault(b => b.Status != (int)BookingStatus.Canceled);
            if (booking == null)
                return NotFound("No valid (non-canceled) booking found for this job.");

            if (booking.HousekeeperID != hk.HousekeeperID)
                return Unauthorized("You are not the assigned housekeeper for this booking.");
            //Tạo đơn payout cho HK
            var payout = new Payout();
            payout.PayoutDate = null;
            payout.Status = (int)PayoutStatus.Pending;
            payout.BookingID = booking.BookingID;
            payout.Amount = jobDetail.Price;
            payout.HousekeeperID = hk.HousekeeperID;

            await _payoutService.AddPayoutAsync(payout);
            // Update booking and job status to pending confirmation by family
            booking.Status = (int)BookingStatus.PendingFamilyConfirmation;
            await _bookingService.UpdateBookingAsync(booking);

            job.Status = (int)JobStatus.PendingFamilyConfirmation;
            await _jobService.UpdateJobAsync(job);
            
            // Send notification to family
            await _notificationService.AddNotificationAsync(new Notification
            {
                AccountID = fa.AccountID,
                Message = $"Housekeeper đã báo công việc #{job.JobID} đã hoàn thành. Hãy xác nhận.",
                RedirectUrl = $"/jobs/{job.JobID}",
                CreatedDate = DateTime.Now
            });

            return Ok("Job marked as completed, awaiting family confirmation.");
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
                Message = "Account not found!";
                return NotFound(Message);
            }
            // Get the job
            var job = await _jobService.GetJobByIDAsync(jobId);
            if (job == null)
                return NotFound("Job not found.");

            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
            if (jobDetail == null)
                return NotFound("JobDetail not found.");

            if (job.FamilyID != fa.FamilyID)
                return Unauthorized("You are not the owner of this job.");

            if (job.Status != (int)JobStatus.PendingFamilyConfirmation)
                return BadRequest("Job is not awaiting confirmation.");

            // Get the booking for the job
            var bookings = await _bookingService.GetBookingsByJobIDAsync(jobId);

            if (bookings == null || !bookings.Any())
                return NotFound("No bookings found for this job.");

            var booking = bookings.FirstOrDefault(b => b.Status != (int)BookingStatus.Canceled);
            if (booking == null)
                return NotFound("No valid (non-canceled) booking found.");

            if (booking.Status != (int)BookingStatus.PendingFamilyConfirmation)
                return BadRequest("Booking is not awaiting confirmation.");

            //Tạo đơn payment cho FA
            var payment = new Payment();
            payment.FamilyID = fa.FamilyID;
            payment.PaymentDate = DateTime.Now;
            payment.Amount = jobDetail.Price;
            payment.Commission = jobDetail.Price * 0.1m;
            payment.JobID = job.JobID;
            payment.Status = (int)PaymentStatus.Completed;

            await _paymentService.AddPaymentAsync(payment);

            //Update payout

            var payout =await _payoutService.GetPayoutByJobIDAsync(job.JobID);
            if (payout == null)
            {
                Message = "No payout found!";
                return NotFound(Message);
            }
            payout.Status = (int)PaymentStatus.Completed;
            payout.PayoutDate = DateTime.Now;

            await _payoutService.UpdatePayoutAsync(payout);
            // Update statuses to completed
            booking.Status = (int)BookingStatus.Completed;
            await _bookingService.UpdateBookingAsync(booking);
            var hk = await _houseKeeperService.GetHousekeeperByIDAsync(booking.HousekeeperID);
            if (hk == null)
            {
                Message = "Account not found!";
                return NotFound(Message);
            }

            job.Status = (int)JobStatus.Completed;
            await _jobService.UpdateJobAsync(job);

            // Notify housekeeper
            await _notificationService.AddNotificationAsync(new Notification
            {
                AccountID = hk.AccountID,
                Message = $"Gia định đã chấp nhận hoàn thành công việc #{job.JobID}. Chúc mừng",
                RedirectUrl = $"/jobs/{job.JobID}",
                CreatedDate = DateTime.Now
            });

            return Ok("Job and booking successfully marked as completed.");
        }
    }
}