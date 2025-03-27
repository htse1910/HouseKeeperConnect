using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViolationController : ControllerBase
    {
        private readonly IViolationService _violationService;
        private readonly IMapper _mapper;

        public ViolationController(IViolationService violationService, IMapper mapper)
        {
            _violationService = violationService;
            _mapper = mapper;
        }
        [HttpGet("ViolationList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ViolationDisplayDTO>>> GetAllViolations(int pageNumber, int pageSize)
        {
            try
            {
                var violations = await _violationService.GetAllViolationsAsync(pageNumber, pageSize);
                if (violations.Count == 0)
                {
                    return NotFound("No violations found!");
                }

                var violationDTOs = _mapper.Map<List<ViolationDisplayDTO>>(violations);
                return Ok(violationDTOs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetViolationById")]
        [Authorize]
        public async Task<ActionResult<ViolationDisplayDTO>> GetViolationById([FromQuery] int id)
        {
            var violation = await _violationService.GetViolationByIDAsync(id);
            if (violation == null)
            {
                return NotFound("Violation not found!");
            }

            var violationDTO = _mapper.Map<ViolationDisplayDTO>(violation);
            return Ok(violationDTO);
        }

        [HttpPost("CreateViolation")]
        [Authorize]
        public async Task<ActionResult> CreateViolation([FromQuery] ViolationCreateDTO violationCreateDTO)
        {
            if (violationCreateDTO == null)
            {
                return BadRequest("Invalid violation data.");
            }

            var violation = _mapper.Map<Violation>(violationCreateDTO);
            await _violationService.AddViolationAsync(violation);
            return Ok("Violation created successfully!");
        }

        [HttpPut("UpdateViolation")]
        [Authorize]
        public async Task<ActionResult> UpdateViolation([FromQuery] ViolationUpdateDTO violationUpdateDTO)
        {
            try
            {
                var existingViolation = await _violationService.GetViolationByIDAsync(violationUpdateDTO.ViolationID);
                if (existingViolation == null)
                {
                    return NotFound("Violation not found!");
                }

                var updatedViolation = _mapper.Map(violationUpdateDTO, existingViolation);
                await _violationService.UpdateViolationAsync(updatedViolation);
                return Ok("Violation updated successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteViolation")]
        [Authorize]
        public async Task<ActionResult> DeleteViolation([FromQuery] int id)
        {
            try
            {
                var violation = await _violationService.GetViolationByIDAsync(id);
                if (violation == null)
                {
                    return NotFound("Violation not found!");
                }

                await _violationService.DeleteViolationAsync(id);
                return Ok("Violation deleted successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
