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
        private string Message;
        private readonly IMapper _mapper;
        public JobController(IJobService jobService, IMapper mapper)
        {
            _jobService = jobService;
            _mapper = mapper;
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
        public async Task<ActionResult> AddJob([FromQuery] JobCreateDTO jobCreateDTO)
        {
            if (jobCreateDTO == null)
            {
                return BadRequest("Invalid job data.");
            }
            var job = _mapper .Map<Job>(jobCreateDTO);

            job.Status = (int) JobStatus.Pending;

            await _jobService.AddJobAsync(job);


            
            var jobDetail = _mapper .Map<JobDetail>(jobCreateDTO);
            jobDetail.JobID = job.JobID;
            // Add job details
            await _jobService.AddJobDetailAsync(jobDetail);

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
            var detail = _mapper .Map<JobDetail>(jobUpdateDTO);
            var jobDetail = await _jobService.GetJobDetailByJobIDAsync(jobUpdateDTO.JobID);
            if(jobDetail==null)
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
