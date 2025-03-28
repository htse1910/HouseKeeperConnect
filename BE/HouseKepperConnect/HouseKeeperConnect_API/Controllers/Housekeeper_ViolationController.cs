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
    public class Housekeeper_ViolationController : ControllerBase
    {
        private readonly IHousekeeper_ViolationService _housekeeperViolationService;
        private readonly IHouseKeeperService _housekeeperService;
        private readonly IViolationService _violationService;
        private readonly IMapper _mapper;

        public Housekeeper_ViolationController(IHousekeeper_ViolationService housekeeperViolationService, IHouseKeeperService housekeeperService, IViolationService violationService, IMapper mapper)
        {
            _housekeeperViolationService = housekeeperViolationService;
            _housekeeperService = housekeeperService;
            _violationService = violationService;
            _mapper = mapper;
        }

        [HttpGet("GetViolationsByHousekeeperId")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Housekeeper_ViolationDisplayDTO>>> GetViolationsByHousekeeperId([FromQuery] int housekeeperId)
        {
            var violations = await _housekeeperViolationService.GetViolationByHousekeeperIdAsync(housekeeperId);
            if (violations == null || violations.Count == 0)
            {
                return NotFound("No violations found for this housekeeper!");
            }

            var violationDTOs = _mapper.Map<List<Housekeeper_ViolationDisplayDTO>>(violations);
            return Ok(violationDTOs);
        }

        [HttpPost("AddViolation")]
        [Authorize]
        public async Task<IActionResult> AddViolationToHousekeeper([FromQuery] Housekeeper_ViolationCreateDTO violationDTO)
        {
            if (violationDTO == null)
            {
                return BadRequest("Invalid data.");
            }

            var housekeeper = await _housekeeperService.GetHousekeeperByIDAsync(violationDTO.HousekeeperID);
            if (housekeeper == null)
            {
                return NotFound("Housekeeper not found!");
            }

            var violation = await _violationService.GetViolationByIDAsync(violationDTO.ViolationID);
            if (violation == null)
            {
                return NotFound("Violation not found!");
            }

            var existingViolation = await _housekeeperViolationService.GetViolationByHousekeeperIdAsync(violationDTO.HousekeeperID);
            if (existingViolation.Any(v => v.ViolationID == violationDTO.ViolationID))
            {
                return BadRequest("Housekeeper already has this violation!");
            }

            var violationEntity = _mapper.Map<Housekeeper_Violation>(violationDTO);
            violationEntity.ViolationDate = DateTime.Now;
            await _housekeeperViolationService.AddViolationToHousekeeperAsync(violationEntity);

            return Ok("Violation added successfully!");
        }

        [HttpDelete("RemoveViolation")]
        [Authorize]
        public async Task<IActionResult> RemoveViolationFromHousekeeper([FromQuery] int housekeeperId, [FromQuery] int violationId)
        {
            var existingViolations = await _housekeeperViolationService.GetViolationByHousekeeperIdAsync(housekeeperId);
            if (!existingViolations.Any(v => v.ViolationID == violationId))
            {
                return NotFound("Violation not found for this housekeeper!");
            }

            await _housekeeperViolationService.RemoveViolationFromHousekeeperAsync(housekeeperId, violationId);
            return Ok("Violation removed successfully!");
        }
    }
}