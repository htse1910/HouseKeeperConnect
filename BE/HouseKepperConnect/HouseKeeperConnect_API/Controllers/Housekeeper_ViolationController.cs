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

        [HttpGet("GetViolationsByAccountId")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Housekeeper_ViolationDisplayDTO>>> GetViolationsByAccountId([FromQuery] int accountId)
        {
            var housekeeper = await _housekeeperService.GetHousekeeperByUserAsync(accountId);
            if (housekeeper == null)
            {
                return NotFound("Housekeeper not found for this account!");
            }

            var violations = await _housekeeperViolationService.GetViolationByHousekeeperIdAsync(housekeeper.HousekeeperID);
            if (violations == null || violations.Count == 0)
            {
                return NotFound("No violations found for this housekeeper!");
            }

            var violationDTOs = _mapper.Map<List<Housekeeper_ViolationDisplayDTO>>(violations);
            return Ok(violationDTOs);
        }

        [HttpPost("AddViolation")]
        [Authorize]
        public async Task<IActionResult> AddViolationToHousekeeper([FromQuery] int accountId, [FromQuery] int violationId)
        {
            var housekeeper = await _housekeeperService.GetHousekeeperByUserAsync(accountId);
            if (housekeeper == null)
            {
                return NotFound("Housekeeper not found for this account!");
            }

            var violation = await _violationService.GetViolationByIDAsync(violationId);
            if (violation == null)
            {
                return NotFound("Violation not found!");
            }

            var existingViolations = await _housekeeperViolationService.GetViolationByHousekeeperIdAsync(housekeeper.HousekeeperID);
            if (existingViolations.Any(v => v.ViolationID == violationId))
            {
                return BadRequest("Housekeeper already has this violation!");
            }

            var violationEntity = new Housekeeper_Violation
            {
                HousekeeperID = housekeeper.HousekeeperID,
                ViolationID = violationId,
                ViolationDate = DateTime.Now
            };

            await _housekeeperViolationService.AddViolationToHousekeeperAsync(violationEntity);
            return Ok("Violation added successfully!");
        }


        [HttpDelete("RemoveViolation")]
        [Authorize]
        public async Task<IActionResult> RemoveViolationFromHousekeeper([FromQuery] int accountId, [FromQuery] int violationId)
        {
            var housekeeper = await _housekeeperService.GetHousekeeperByUserAsync(accountId);
            if (housekeeper == null)
            {
                return NotFound("Housekeeper not found for this account!");
            }

            var existingViolations = await _housekeeperViolationService.GetViolationByHousekeeperIdAsync(housekeeper.HousekeeperID);
            if (!existingViolations.Any(v => v.ViolationID == violationId))
            {
                return NotFound("Violation not found for this housekeeper!");
            }

            await _housekeeperViolationService.RemoveViolationFromHousekeeperAsync(housekeeper.HousekeeperID, violationId);
            return Ok("Violation removed successfully!");
        }

    }
}