using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Services;
using Services.Interface;
using System.Security.Claims;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IAccountService _accountService;
        private string Message;
        private readonly IMapper _mapper;

        public ReportsController(IReportService reportService, IMapper mapper, IAccountService accountService)
        {
            _reportService = reportService;
            _mapper = mapper;
            _accountService = accountService;
        }

        [HttpGet("ReportList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ReportDisplayDTO>>> GetAllReports(int pageNumber, int pageSize)
        {
            try
            {
                var reports = await _reportService.GetAllReportsAsync(pageNumber, pageSize);
                if (reports.Count == 0)
                {
                    return NotFound("No reports found!");
                }

                var reportDTOs = _mapper.Map<List<ReportDisplayDTO>>(reports);
                return Ok(reportDTOs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetReportById")]
        [Authorize]
        public async Task<ActionResult<ReportDisplayDTO>> GetReportById([FromQuery] int id)
        {
            var Report = await _reportService.GetReportByIDAsync(id);
            if (Report == null)
            {
                return NotFound("Report not found!");
            }

            var ReportDTO = _mapper.Map<ReportDisplayDTO>(Report);
            return Ok(ReportDTO);
        }

        [HttpGet("GetReportByAccountId")]
        [Authorize]
        public async Task<ActionResult<ReportDisplayDTO>> GetReportByAccountId([FromQuery] int accountId)
        {
            var Report = await _reportService.GetReportsByAccountAsync(accountId);
            if (Report == null)
            {
                return NotFound("Report not found!");
            }

            var ReportDTO = _mapper.Map<ReportDisplayDTO>(Report);
            return Ok(ReportDTO);
        }


        [HttpPost("CreateReport")]
        public async Task<ActionResult> CreateReport([FromQuery] ReportCreateDTO reportCreateDTO)
        {
            if (reportCreateDTO == null)
            {
                return BadRequest("Invalid report data.");
            }

            var report = _mapper.Map<Report>(reportCreateDTO);
            report.CreateAt = DateTime.Now;
            report.ReportStatus = 1;
            await _reportService.AddReportAsync(report);
            return Ok("Report created successfully!");
        }

        [HttpPut("UpdateReport")]
        [Authorize]
        public async Task<ActionResult> UpdateReport([FromQuery]  ReportUpdateDTO reportUpdateDTO)
        {
            try
            {
                var existingReport = await _reportService.GetReportByIDAsync(reportUpdateDTO.ReportID);
                if (existingReport == null)
                {
                    return NotFound("Report not found!");
                }
                if (reportUpdateDTO.ReviewByID == null)
                {
                    return BadRequest("ReviewByID is required!");
                }

                var reviewerAccount = await _accountService.GetAccountByIDAsync(reportUpdateDTO.ReviewByID.Value);
                if (reviewerAccount == null)
                {
                    return NotFound("Reviewer account not found!");
                }

                if (reviewerAccount.RoleID != 3)
                {
                    return BadRequest("Only staff can review reports!");
                }
                var updatedReport = _mapper.Map(reportUpdateDTO, existingReport);
                existingReport.ReviewedAt = DateTime.UtcNow;
                await _reportService.UpdateReportAsync(updatedReport);
                return Ok("Report updated successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteReport")]
        [Authorize]
        public async Task<ActionResult> DeleteReport([FromQuery] int id)
        {
            try
            {
                var report = await _reportService.GetReportByIDAsync(id);
                if (report == null)
                {
                    return NotFound("Report not found!");
                }

                await _reportService.DeleteReportAsync(id);
                return Ok("Report deleted successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}