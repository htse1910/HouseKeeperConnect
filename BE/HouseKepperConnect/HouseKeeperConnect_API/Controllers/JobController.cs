using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
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
        private string Message;
        private readonly IMapper _mapper;

        public JobController(IJobService jobService, IMapper mapper, IJob_ServiceService job_ServiceService, IJob_SlotsService job_SlotsService, IBookingService bookingService)
        {
            _jobService = jobService;
            _jobServiceService = job_ServiceService;
            _jobSlotsService = job_SlotsService;
            _mapper = mapper;
            _bookingService = bookingService;
        }

        [HttpGet("JobList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobsAsync()
        {
            var jobs = await _jobService.GetAllJobsAsync();
            if (jobs == null || !jobs.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(jobs);
        }

        [HttpGet("GetJobByID")]
        [Authorize]
        public async Task<ActionResult<Job>> GetJobByID([FromQuery] int id)
        {
            var job = await _jobService.GetJobByIDAsync(id);
            if (job == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(job);
        }

        [HttpGet("GetJobDetailByID")]
        [Authorize]
        public async Task<ActionResult<JobDisplayDTO>> GetJobDetailByID([FromQuery] int id)
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

            var JobSlotDay = await _jobSlotsService.GetAllJob_SlotsAsync();
            var JobService = await _jobServiceService.GetAllJob_ServicesAsync();

            /*            foreach ( var SlotDay in JobSlotDay)
                        {
                            slots.Add(SlotDay.SlotID);
                            days.Add(SlotDay.DayOfWeek);
                        }

                        foreach ( var ser in JobService)
                        {
                            services.Add(ser.ServiceID);
                        }*/

            var displayDTO = new JobDisplayDTO();

            _mapper.Map(job, displayDTO);
            _mapper.Map(jobDetail, displayDTO);

            displayDTO.SlotIDs = JobSlotDay.Select(slot => slot.SlotID).Distinct().ToList();
            displayDTO.DayofWeek = JobSlotDay.Select(slot => slot.DayOfWeek).Distinct().ToList();
            displayDTO.ServiceIDs = JobService.Select(service => service.ServiceID).Distinct().ToList();

            return Ok(displayDTO);
        }

        [HttpGet("GetJobsByAccountID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobsByAccountID([FromQuery] int accountId)
        {
            var jobs = await _jobService.GetJobsByAccountIDAsync(accountId);
            if (jobs == null || !jobs.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(jobs);
        }

        [HttpPost("AddJob")]
        [Authorize]
        public async Task<ActionResult> AddJob([FromQuery] JobCreateDTO jobCreateDTO)
        {
            if (jobCreateDTO == null)
            {
                return BadRequest("Invalid job data.");
            }
            var job = _mapper.Map<Job>(jobCreateDTO);

            job.Status = (int)JobStatus.Pending;

            await _jobService.AddJobAsync(job);

            var jobDetail = _mapper.Map<JobDetail>(jobCreateDTO);
            jobDetail.JobID = job.JobID;
            // Add job details
            await _jobService.AddJobDetailAsync(jobDetail);
            //Add job service ids
            foreach (var serviceID in jobCreateDTO.ServiceIDs)
            {
                var jobService = new Job_Service
                {
                    JobID = job.JobID,
                    ServiceID = serviceID
                };

                await _jobServiceService.AddJob_ServiceAsync(jobService);
            }
            // Add job slot ids
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
            // Create Booking if isOffered = true**
            if (jobCreateDTO.IsOffered && jobCreateDTO.HousekeeperID.HasValue)
            {
                var newBooking = new Booking
                {
                    JobID = job.JobID,
                    HousekeeperID = jobCreateDTO.HousekeeperID.Value,
                    FamilyID = jobCreateDTO.FamilyID,
                    CreatedAt = DateTime.UtcNow,
                    BookingStatus = (int)BookingStatus.Pending
                };

                await _bookingService.AddBookingAsync(newBooking);
            }

            return Ok("Job and its details added successfully!");
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