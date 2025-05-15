using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.DTOs;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamilyPreferenceSkillController : ControllerBase
    {
        private readonly IFamilyPreferenceSkillService _familyPreferenceSkillService;
        private readonly IMapper _mapper;

        public FamilyPreferenceSkillController(IFamilyPreferenceSkillService familyPreferenceSkillService, IMapper mapper)
        {
            _familyPreferenceSkillService = familyPreferenceSkillService;
            _mapper = mapper;
        }

        [HttpGet("GetFamilyPreferenceSkillByFamilyPreferenceID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FamilyPreferenceSkill>>> GetFamilyPreferenceSkillByFamilyPreferenceID([FromQuery] int familyPreferenceId)
        {
            var skills = await _familyPreferenceSkillService.GetFamilyPreferenceSkillByFamilyPreferenceIDAsync(familyPreferenceId);
            if (skills == null || !skills.Any())
                return NotFound("No skills found for this family preference.");

            return Ok(skills);
        }

        [HttpPost("AddFamilyPreferenceSkill")]
        [Authorize]
        public async Task<ActionResult> AddFamilyPreferenceSkill([FromBody] FamilyPreferenceSkillCreateDTO skillDTO)
        {
            var skill = _mapper.Map<FamilyPreferenceSkill>(skillDTO);
            await _familyPreferenceSkillService.AddFamilyPreferenceSkillAsync(skill);
            return Ok("Family preference skill added successfully.");
        }

        [HttpPut("UpdateFamilyPreferenceSkill")]
        [Authorize]
        public async Task<ActionResult> UpdateFamilyPreferenceSkill([FromBody] FamilyPreferenceSkillUpdateDTO skillDTO)
        {
            var skill = _mapper.Map<FamilyPreferenceSkill>(skillDTO);
            await _familyPreferenceSkillService.UpdateFamilyPreferenceSkillAsync(skill);
            return Ok("Family preference skill updated successfully.");
        }

        [HttpDelete("DeleteFamilyPreferenceSkill")]
        [Authorize]
        public async Task<ActionResult> DeleteFamilyPreferenceSkill([FromQuery] int id)
        {
            await _familyPreferenceSkillService.DeleteFamilyPreferenceSkillAsync(id);
            return Ok("Family preference skill deleted successfully.");
        }
    }
}
