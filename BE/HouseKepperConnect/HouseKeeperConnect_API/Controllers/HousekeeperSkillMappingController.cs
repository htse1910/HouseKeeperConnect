using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interface;
using Services;
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
        [HttpGet("GetSkillsByHousekeeperID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<HousekeeperSkillMappingDisplayDTO>>> GetSkillsByHousekeeperId(int housekeeperId)
        {
            var skills = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(housekeeperId);
            if (skills == null || skills.Count == 0)
            {
                return NotFound("No skills found for this housekeeper.");
            }
            var skillDTOs = _mapper.Map<List<HousekeeperSkillMappingDisplayDTO>>(skills);
            return Ok(skillDTOs);
        }

        [HttpPost("AddSkill")]
        [Authorize]
        public async Task<IActionResult> AddSkillToHousekeeper([FromBody] HousekeeperSkillMappingCreateDTO housekeeperSkillMappingCreateDTO)
        {
            if (housekeeperSkillMappingCreateDTO == null)
            {
                return BadRequest("Invalid data.");
            }
          
            var housekeeper = await _housekeeperService.GetHousekeeperByIDAsync(housekeeperSkillMappingCreateDTO.HousekeeperID);
            if (housekeeper == null)
            {
                return NotFound("Housekeeper not found!");
            }

            
            var skill = await _housekeeperSkillService.GetHouseKeeperSkillByIDAsync(housekeeperSkillMappingCreateDTO.HouseKeeperSkillID);
            if (skill == null)
            {
                return NotFound("Skill not found!");
            }


            var existingMapping = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(housekeeperSkillMappingCreateDTO.HousekeeperID);
            if (existingMapping != null)
            {
                return BadRequest("Housekeeper already has this skill!");
            }
            var skillEntity = _mapper.Map<HousekeeperSkillMapping>(housekeeperSkillMappingCreateDTO);
            await _housekeeperSkillMappingService.AddSkillToHousekeeperAsync(skillEntity);
            return Ok("Skill added successfully!");
        }

        [HttpDelete("RemoveSkill")]
        [Authorize]
        public async Task<IActionResult> RemoveSkillFromHousekeeper([FromQuery] int housekeeperId, [FromQuery] int skillId)
        {
            var existingSkill = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(housekeeperId);
            if (existingSkill == null)
            {
                return NotFound("Skill mapping not found!");
            }
            await _housekeeperSkillMappingService.RemoveSkillFromHousekeeperAsync(housekeeperId, skillId);
            return Ok("Skill removed successfully!");
        }

    }
}
