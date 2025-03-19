using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BusinessObject.Models;
using AutoMapper;
using Services.Interface;
using BusinessObject.DTO;
using DataAccess;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]

    public class VerificationTasksController : ControllerBase
    {
        private readonly IVerificationTaskService _verificationTaskService;
        private readonly IMapper _mapper;
        public VerificationTasksController(IVerificationTaskService verificationTaskService, IMapper mapper)
        {
            _verificationTaskService = verificationTaskService;
            _mapper = mapper;
        }
        [HttpPost("CreateVerificationTasks")]
        public async Task<IActionResult> CreateVerificationTask([FromQuery] int verifyID)
        {
            try
            {
                var task = new VerificationTask
                {
                    VerifyID = verifyID,
                    Status = 1, // Pending
                    AssignedDate = DateTime.UtcNow
                };

                int taskId = await _verificationTaskService.CreateVerificationTaskAsync(task);

                return Ok(new { Message = "Verification Task created successfully!", TaskID = taskId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }




        [HttpGet("PendingTasksList")]
        public async Task<IActionResult> GetPendingVerificationTasks()
        {
            try
            {
                var tasks = await _verificationTaskService.GetPendingVerificationTasksAsync();
                if (tasks == null || !tasks.Any()) 
                {
                    return NotFound("No pending verification tasks.");
                }
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpPost("approve")]
        public async Task<IActionResult> ApproveVerification(int taskId, [FromQuery] VerificationRequestDTO request)
        {
            try
            {
                var result = await _verificationTaskService.ApproveVerificationAsync(taskId, request.AccountID, request.Notes);
                if (!result)
                {
                    return NotFound("Task not found or already processed.");
                }
                return Ok("Verification approved successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("reject")]
        public async Task<IActionResult> RejectVerification(int taskId, [FromQuery] VerificationRequestDTO request)
        {
            try
            {
                var result = await _verificationTaskService.RejectVerificationAsync(taskId, request.AccountID, request.Notes);
                if (!result)
                {
                    return NotFound("Task not found or already processed.");
                }
                return Ok("Verification rejected successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
