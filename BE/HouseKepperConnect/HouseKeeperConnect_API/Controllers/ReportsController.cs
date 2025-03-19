using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private string Message;
        private readonly IMapper _mapper;

        public ReportsController(IReportService reportService, IMapper mapper)
        {
            _reportService = reportService;

            _mapper = mapper;
        }

        [HttpGet("ReportList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ReportDisplayDTO>>> GetAllReports()
        {
            try
            {
                var reports = await _reportService.GetAllReportsAsync();
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

        [HttpGet("GetReport")]
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
        public async Task<ActionResult> UpdateReport([FromQuery] ReportUpdateDTO reportUpdateDTO)
        {
            try
            {
                var existingReport = await _reportService.GetReportByIDAsync(reportUpdateDTO.ReportID);
                if (existingReport == null)
                {
                    return NotFound("Report not found!");
                }

                var updatedReport = _mapper.Map(reportUpdateDTO, existingReport);

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