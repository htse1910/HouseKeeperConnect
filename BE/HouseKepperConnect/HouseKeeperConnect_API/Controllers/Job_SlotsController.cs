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
    public class Job_SlotsController : ControllerBase
    {
        private readonly IJob_SlotsService _jobSlotsService;
        private readonly IMapper _mapper;
        private string Message;

        public Job_SlotsController(IJob_SlotsService jobSlotsService, IMapper mapper)
        {
            _jobSlotsService = jobSlotsService;
            _mapper = mapper;
        }

        [HttpGet("Job_SlotsList")]
        [Authorize(Policy ="Staff")]
        public async Task<ActionResult<IEnumerable<Job_Slots>>> GetJob_SlotsAsync()
        {
            var jobSlots = await _jobSlotsService.GetAllJob_SlotsAsync();
            if (jobSlots == null || !jobSlots.Any())
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(jobSlots);
        }

        [HttpGet("GetJob_SlotsByID")]
        [Authorize]
        public async Task<ActionResult<Job_Slots>> GetJob_SlotsByID([FromQuery] int id)
        {
            var jobSlot = await _jobSlotsService.GetJob_SlotsByIDAsync(id);
            if (jobSlot == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(jobSlot);
        }

        [HttpPost("AddJob_Slots")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult> AddJob_Slots([FromQuery] Job_SlotsCreateDTO jobSlotsCreateDTO)
        {
            if (jobSlotsCreateDTO == null)
            {
                return BadRequest("Invalid job slots data.");
            }
            var jobSlot = _mapper.Map<Job_Slots>(jobSlotsCreateDTO);
            await _jobSlotsService.AddJob_SlotsAsync(jobSlot);
            return Ok("Job slots added successfully!");
        }

        [HttpDelete("DeleteJob_Slots")]
        [Authorize(Policy = "Staff")]
        public async Task<ActionResult> DeleteJob_Slots([FromQuery] int id)
        {
            await _jobSlotsService.DeleteJob_SlotsAsync(id);
            Message = "Job slots deleted successfully!";
            return Ok(Message);
        }
    }
}