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
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;
        private string Message;
        private readonly IMapper _mapper;

        public ScheduleController(IScheduleService scheduleService, IMapper mapper)
        {
            _scheduleService = scheduleService;
            _mapper = mapper;
        }

        [HttpGet("ScheduleList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Housekeeper_Schedule>>> GetAllSchedulesAsync()
        {
            var schedules = await _scheduleService.GetAllSchedulesAsync();
            if (schedules == null || !schedules.Any())
            {
                Message = "No records found!";
                return NotFound(Message);
            }
            return Ok(schedules);
        }

        [HttpGet("GetScheduleByID")]
        [Authorize]
        public async Task<ActionResult<Housekeeper_Schedule>> GetScheduleByID([FromQuery] int id)
        {
            var schedule = await _scheduleService.GetScheduleByIDAsync(id);
            if (schedule == null)
            {
                Message = "Housekeeper_Schedule not found!";
                return NotFound(Message);
            }
            return Ok(schedule);
        }

        [HttpGet("GetSchedulesByHousekeeper")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Housekeeper_Schedule>>> GetSchedulesByHousekeeper([FromQuery] int housekeeperId)
        {
            var schedules = await _scheduleService.GetScheduleByHousekeeperAsync(housekeeperId);
            if (schedules == null || !schedules.Any())
            {
                Message = "No schedules found for this housekeeper!";
                return NotFound(Message);
            }
            return Ok(schedules);
        }

        [HttpPost("AddSchedule")]
        [Authorize]
        public async Task<ActionResult> AddSchedule([FromQuery] ScheduleCreateDTO scheduleDTO)
        {
            var schedule = _mapper.Map<Housekeeper_Schedule>(scheduleDTO);
            if (scheduleDTO == null)
            {
                return BadRequest("Invalid service data.");
            }

            await _scheduleService.AddScheduleAsync(schedule);
            return Ok("Housekeeper_Schedule added successfully!");
        }

        [HttpPut("UpdateSchedule")]
        [Authorize]
        public async Task<ActionResult> UpdateSchedule([FromQuery] ScheduleUpdateDTO scheduleUpdateDTO)
        {
            var sche = _mapper.Map<Housekeeper_Schedule>(scheduleUpdateDTO);
            var schedule = await _scheduleService.GetScheduleByIDAsync(scheduleUpdateDTO.Housekeeper_ScheduleID);
            if (schedule == null)
            {
                Message = "Housekeeper_Schedule not found!";
                return NotFound(Message);
            }

            await _scheduleService.UpdateScheduleAsync(sche);
            Message = "Housekeeper_Schedule updated successfully!";
            return Ok(Message);
        }
    }
}