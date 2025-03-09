using BusinessObject.DTO;
using BusinessObject.DTOs;
using BusinessObject.Models;
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
        private string Message;

        public JobController(IJobService jobService)
        {
            _jobService = jobService;
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
        public async Task<ActionResult> AddJob([FromBody] JobCreateDTO jobCreateDTO)
        {
            if (jobCreateDTO == null)
            {
                return BadRequest("Invalid job data.");
            }

            // Create Job entity
            var job = new Job
            {
                AccountID = jobCreateDTO.AccountID,
                JobName = jobCreateDTO.JobName,
                Status = jobCreateDTO.Status
            };

            // Add job to database first to get JobID (assuming JobID is auto-generated)
            await _jobService.AddJobAsync(job);

            // Create JobDetail entity
            var jobDetail = new JobDetail
            {
                JobID = job.JobID, // Get the generated JobID
                Frequency = jobCreateDTO.Frequency,
                Location = jobCreateDTO.Location,
                Price = jobCreateDTO.Price,
                ServiceID = jobCreateDTO.ServiceID,
                StartDate = jobCreateDTO.StartDate,
                EndDate = jobCreateDTO.EndDate,
                Description = jobCreateDTO.Description,
                StartSlot = jobCreateDTO.StartSlot,
                EndSlot = jobCreateDTO.EndSlot
            };

            // Add job details
            await _jobService.AddJobDetailAsync(jobDetail);

            return Ok("Job and its details added successfully!");
        }


        [HttpPut("UpdateJob")]
        [Authorize]
        public async Task<ActionResult> UpdateJob([FromBody] JobUpdateDTO jobUpdateDTO)
        {
            var job = await _jobService.GetJobByIDAsync(jobUpdateDTO.JobID);
            if (job == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            job.JobName = jobUpdateDTO.JobName;
            job.Status = jobUpdateDTO.Status;

            await _jobService.UpdateJobAsync(job);
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
