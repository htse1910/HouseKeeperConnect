using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Job_ServiceController : ControllerBase
    {
        private readonly IJob_ServiceService _jobServiceService;
        private readonly IMapper _mapper;
        private string Message;

        public Job_ServiceController(IJob_ServiceService jobServiceService, IMapper mapper)
        {
            _jobServiceService = jobServiceService;
            _mapper = mapper;
        }

        [HttpGet("Job_ServiceList")]
        [Authorize(Policy ="Staff")]
        public async Task<ActionResult<IEnumerable<Job_Service>>> GetJob_ServicesAsync()
        {
            var jobServices = await _jobServiceService.GetAllJob_ServicesAsync();
            if (jobServices == null || !jobServices.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(jobServices);
        }

        [HttpGet("GetJob_ServiceByID")]
        [Authorize]
        public async Task<ActionResult<Job_Service>> GetJob_ServiceByID([FromQuery] int id)
        {
            var jobService = await _jobServiceService.GetJob_ServiceByIDAsync(id);
            if (jobService == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(jobService);
        }

        [HttpPost("AddJob_Service")]
        [Authorize(Policy ="Staff")]
        public async Task<ActionResult> AddJob_Service([FromQuery] Job_ServiceCreateDTO jobServiceCreateDTO)
        {
            if (jobServiceCreateDTO == null)
            {
                return BadRequest("Invalid job service data.");
            }
            var jobService = _mapper.Map<Job_Service>(jobServiceCreateDTO);
            await _jobServiceService.AddJob_ServiceAsync(jobService);
            return Ok("Job service added successfully!");
        }

        [HttpDelete("DeleteJob_Service")]
        [Authorize(Policy ="Staff")]
        public async Task<ActionResult> DeleteJob_Service([FromQuery] int id)
        {
            await _jobServiceService.DeleteJob_ServiceAsync(id);
            Message = "Job service deleted successfully!";
            return Ok(Message);
        }
    }
}