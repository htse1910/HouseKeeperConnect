using BusinessObject.DTO;
using BusinessObject.Models;
using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;
        private string Message;

        public ScheduleController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet("ScheduleList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetAllSchedulesAsync()
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
        public async Task<ActionResult<Schedule>> GetScheduleByID([FromQuery] int id)
        {
            var schedule = await _scheduleService.GetScheduleByIDAsync(id);
            if (schedule == null)
            {
                Message = "Schedule not found!";
                return NotFound(Message);
            }
            return Ok(schedule);
        }

        [HttpGet("GetSchedulesByHousekeeper")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Schedule>>> GetSchedulesByHousekeeper([FromQuery] int housekeeperId)
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
        public async Task<ActionResult> AddSchedule([FromBody] ScheduleCreateDTO scheduleDTO)
        {
            var schedule = new Schedule
            {
                HousekeeperID = scheduleDTO.HousekeeperID,
                SlotID = scheduleDTO.SlotID,
                Date = scheduleDTO.Date,
                ScheduleTypeID = scheduleDTO.ScheduleTypeID,
                Status = scheduleDTO.Status
            };

            // Add schedule to database
            await _scheduleService.AddScheduleAsync(schedule);
            return Ok("Schedule added successfully!");
        }
    

        [HttpPut("UpdateSchedule")]
        [Authorize]
        public async Task<ActionResult> UpdateSchedule([FromQuery] int id, [FromBody] ScheduleUpdateDTO scheduleUpdateDTO)
        {
            var schedule = await _scheduleService.GetScheduleByIDAsync(id);
            if (schedule == null)
            {
                Message = "Schedule not found!";
                return NotFound(Message);
            }

            await _scheduleService.UpdateScheduleAsync(schedule);
            Message = "Schedule updated successfully!";
            return Ok(Message);
        }
    }
}
