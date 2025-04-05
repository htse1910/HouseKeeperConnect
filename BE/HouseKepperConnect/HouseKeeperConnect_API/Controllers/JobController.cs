using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
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
        private string Message;
        private readonly IMapper _mapper;

        public JobController(IJobService jobService, IMapper mapper, IJob_ServiceService job_ServiceService, IJob_SlotsService job_SlotsService, IBookingService bookingService, IBooking_SlotsService bookingSlotsService, INotificationService notificationService,
            IFamilyProfileService familyProfileService, IHouseKeeperService houseKeeperService)
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
        }

        [HttpGet("JobList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsAsync()
        {
            var jobs = await _jobService.GetAllJobsAsync();

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
        public async Task<ActionResult<IEnumerable<JobDisplayDTO>>> GetJobsByAccountID([FromQuery] int accountId)
        {

            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(accountId);
            if (fa == null)
            {
                Message = "No account found";
                return NotFound(Message);
            }
            var jobs = await _jobService.GetJobsByAccountIDAsync(fa.FamilyID);
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
            if (jobCreateDTO == null)
            {
                return BadRequest("Invalid job data.");
            }

            // Create a new job with a 'Pending' status
            var job = _mapper.Map<Job>(jobCreateDTO);
            job.Status = (int)JobStatus.Pending;

            // Save the job
            await _jobService.AddJobAsync(job);

            // Add job details
            var jobDetail = _mapper.Map<JobDetail>(jobCreateDTO);
            jobDetail.JobID = job.JobID;
            await _jobService.AddJobDetailAsync(jobDetail);

            // Add job services
            foreach (var serviceID in jobCreateDTO.ServiceIDs)
            {
                var jobService = new Job_Service
                {
                    JobID = job.JobID,
                    ServiceID = serviceID
                };
                await _jobServiceService.AddJob_ServiceAsync(jobService);
            }

            // Add job slots
            foreach (var slotID in jobCreateDTO.SlotIDs)
            {
                foreach (var day in jobCreateDTO.DayofWeek)
                {
                    var jobSlot = new Job_Slots
                    {
                        JobID = job.JobID,
                        SlotID = slotID,
                        DayOfWeek = day
                    };
                    await _jobSlotsService.AddJob_SlotsAsync(jobSlot);
                }
            }

            return Ok("Job created successfully!");
        }

        [HttpPost("AddJobForHousekeeper")]
        [Authorize]
        public async Task<ActionResult> AddJobForHousekeeper([FromQuery] JobCreateDTO jobCreateDTO)
        {
            if (jobCreateDTO == null || !jobCreateDTO.HousekeeperID.HasValue)
            {
                return BadRequest("Invalid data. HousekeeperID is required when IsOffered is true.");
            }

            // Check if the slots are available for the housekeeper
            foreach (var slotID in jobCreateDTO.SlotIDs)
            {
                foreach (var day in jobCreateDTO.DayofWeek)
                {
                    // Check if any of the slots are already booked for the housekeeper in the given date range
                    bool isSlotBooked = await _bookingSlotsService.IsSlotBooked(
                        jobCreateDTO.HousekeeperID.Value, slotID, day, jobCreateDTO.StartDate, jobCreateDTO.EndDate
                    );

                    if (isSlotBooked)
                    {
                        // If the slot is already booked, return a conflict error and prevent the job creation
                        return Conflict($"Slot {slotID} for day {day} is already booked for this housekeeper in the selected date range.");
                    }
                }
            }

            // Create a new job with a 'Pending' status
            var job = _mapper.Map<Job>(jobCreateDTO);
            job.Status = (int)JobStatus.Pending;  // Job is still Pending until the housekeeper accepts

            // Save the job
            await _jobService.AddJobAsync(job);

            // Add job details
            var jobDetail = _mapper.Map<JobDetail>(jobCreateDTO);
            jobDetail.JobID = job.JobID;
            await _jobService.AddJobDetailAsync(jobDetail);

            // Add job services
            foreach (var serviceID in jobCreateDTO.ServiceIDs)
            {
                var jobService = new Job_Service
                {
                    JobID = job.JobID,
                    ServiceID = serviceID
                };
                await _jobServiceService.AddJob_ServiceAsync(jobService);
            }

            // Add job slots
            foreach (var slotID in jobCreateDTO.SlotIDs)
            {
                foreach (var day in jobCreateDTO.DayofWeek)
                {
                    var jobSlot = new Job_Slots
                    {
                        JobID = job.JobID,
                        SlotID = slotID,
                        DayOfWeek = day
                    };
                    await _jobSlotsService.AddJob_SlotsAsync(jobSlot);
                }
            }

            return Ok("Job created successfully for the housekeeper!");
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
                // Retrieve the job details
                var job = await _jobService.GetJobByIDAsync(jobId);
                if (job == null)
                {
                    return NotFound("Job not found.");
                }

                // If the job has already been accepted, return an error
                if (job.Status == 3)
                {
                    return BadRequest("Job has already been accepted.");
                }

                // Retrieve job details for booking slots (JobDetail)
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

                // Ensure there are no conflicting bookings for the given slots
                foreach (var slot in jobSlots)
                {
                    bool isSlotBooked = await _bookingSlotsService.IsSlotBooked(jobDetail.HousekeeperID.Value, slot.SlotID, slot.DayOfWeek, jobDetail.StartDate, jobDetail.EndDate);
                    if (isSlotBooked)
                    {
                        job.Status = 2;
                        await _jobService.UpdateJobAsync(job);
                        return Conflict($"Slot {slot.SlotID} on day {slot.DayOfWeek} is already booked.");
                    }
                }
                job.Status = 3;
                // Set job status to Accepted

                await _jobService.UpdateJobAsync(job);

                // Create the booking
                var newBooking = new Booking
                {
                    JobID = jobId,
                    HousekeeperID = jobDetail.HousekeeperID.Value,
                    CreatedAt = DateTime.Now,
                    Status = (int)BookingStatus.Pending
                };

                await _bookingService.AddBookingAsync(newBooking);

                // Create the booking slots
                foreach (var slot in jobSlots)
                {
                    var bookingSlot = new Booking_Slots
                    {
                        BookingID = newBooking.BookingID,
                        SlotID = slot.SlotID,
                        DayOfWeek = slot.DayOfWeek
                    };

                    await _bookingSlotsService.AddBooking_SlotsAsync(bookingSlot);
                }

                return Ok("Job accepted, booking and booking slots created successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AcceptJob: {ex.Message}");
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

        [HttpDelete("DeleteJob")]
        [Authorize]
        public async Task<ActionResult> DeleteJob([FromQuery] int id)
        {
            await _jobService.DeleteJobAsync(id);
            Message = "Job deleted successfully!";
            return Ok(Message);
        }
    }
}