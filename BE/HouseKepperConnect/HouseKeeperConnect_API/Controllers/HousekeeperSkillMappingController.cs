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
    public class HousekeeperSkillMappingController : ControllerBase
    {
        private readonly IHousekeeperSkillMappingService _housekeeperSkillMappingService;
        private readonly IMapper _mapper;
        private readonly IHouseKeeperService _housekeeperService;
        private readonly IHousekeeperSkillService _housekeeperSkillService;

        public HousekeeperSkillMappingController(IHousekeeperSkillMappingService housekeeperSkillMappingService, IMapper mapper, IHouseKeeperService housekeeperService, IHousekeeperSkillService housekeeperSkillService)
        {
            _housekeeperSkillMappingService = housekeeperSkillMappingService;
            _mapper = mapper;
            _housekeeperService = housekeeperService;
            _housekeeperSkillService = housekeeperSkillService;
        }

        [HttpGet("GetSkillsByAccountID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<HousekeeperSkillMappingDisplayDTO>>> GetSkillsByAccountId(int accountId)
        {
            var housekeeperId = await _housekeeperService.GetHousekeeperByUserAsync(accountId);
            if (housekeeperId == null)
            {
                return NotFound("Housekeeper not found for this account.");
            }

            var skills = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(housekeeperId.HousekeeperID);
            if (skills == null || skills.Count == 0)
            {
                return NotFound("No skills found for this housekeeper.");
            }

            var skillDTOs = _mapper.Map<List<HousekeeperSkillMappingDisplayDTO>>(skills);
            return Ok(skillDTOs);
        }


        [HttpPost("AddSkill")]
        [Authorize]
        public async Task<IActionResult> AddSkillToHousekeeper([FromQuery] int accountId, [FromQuery] int skillId)
        {
            var housekeeperId = await _housekeeperService.GetHousekeeperByUserAsync(accountId);
            if (housekeeperId == null)
            {
                return NotFound("Housekeeper not found for this account.");
            }

            var housekeeper = await _housekeeperService.GetHousekeeperByIDAsync(housekeeperId.HousekeeperID);
            if (housekeeper == null)
            {
                return NotFound("Housekeeper not found!");
            }

            var skill = await _housekeeperSkillService.GetHouseKeeperSkillByIDAsync(skillId);
            if (skill == null)
            {
                return NotFound("Skill not found!");
            }

            var existingMapping = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(housekeeperId.HousekeeperID);
            if (existingMapping.Any(hs => hs.HouseKeeperSkillID == skillId))
            {
                return BadRequest("Housekeeper already has this skill!");
            }

            var skillEntity = new HousekeeperSkillMapping
            {
                HousekeeperID = housekeeperId.HousekeeperID,
                HouseKeeperSkillID = skillId
            };

            await _housekeeperSkillMappingService.AddSkillToHousekeeperAsync(skillEntity);
            return Ok("Skill added successfully!");
        }


        [HttpDelete("RemoveSkill")]
        [Authorize]
        public async Task<IActionResult> RemoveSkillFromHousekeeper([FromQuery] int accountId, [FromQuery] int skillId)
        {
            var housekeeper = await _housekeeperService.GetHousekeeperByUserAsync(accountId);
            if (housekeeper == null)
            {
                return NotFound("Housekeeper not found for this account.");
            }

            var existingSkill = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(housekeeper.HousekeeperID);
            if (existingSkill == null || !existingSkill.Any(hs => hs.HouseKeeperSkillID == skillId))
            {
                return NotFound("Skill mapping not found!");
            }

            await _housekeeperSkillMappingService.RemoveSkillFromHousekeeperAsync(housekeeper.HousekeeperID, skillId);
            return Ok("Skill removed successfully!");
        }

    }
}