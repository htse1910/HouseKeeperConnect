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
    public class HouseKeeperSkillsController : ControllerBase
    {
        private readonly IHousekeeperSkillService _housekeeperSkillService;
        private readonly IMapper _mapper;

        public HouseKeeperSkillsController(IHousekeeperSkillService housekeeperSkillService, IMapper mapper)
        {
            _housekeeperSkillService = housekeeperSkillService;
            _mapper = mapper;
        }

        [HttpGet("HousekeeperSkillList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<HouseKeeperSkillDisplayDTO>>> GetAllHousekeeperSkills(int pageNumber, int pageSize)
        {
            try
            {
                var skills = await _housekeeperSkillService.GetAllHouseKeeperSkillsAsync(pageNumber, pageSize);
                if (skills.Count == 0)
                {
                    return NotFound("No skills found!");
                }

                var skillDTOs = _mapper.Map<List<HouseKeeperSkillDisplayDTO>>(skills);
                return Ok(skillDTOs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetHousekeeperSkillById")]
        [Authorize]
        public async Task<ActionResult<HouseKeeperSkillDisplayDTO>> GetHousekeeperSkillById([FromQuery] int id)
        {
            var skill = await _housekeeperSkillService.GetHouseKeeperSkillByIDAsync(id);
            if (skill == null)
            {
                return NotFound("Skill not found!");
            }

            var skillDTO = _mapper.Map<HouseKeeperSkillDisplayDTO>(skill);
            return Ok(skillDTO);
        }

        [HttpPost("CreateHousekeeperSkill")]
        [Authorize]
        public async Task<ActionResult> CreateHousekeeperSkill([FromBody] HousekeeperSkillCreateDTO housekeeperSkillCreateDTO)
        {
            if (housekeeperSkillCreateDTO == null)
            {
                return BadRequest("Invalid skill data.");
            }

            var skill = _mapper.Map<HouseKeeperSkill>(housekeeperSkillCreateDTO);
            await _housekeeperSkillService.AddHouseKeeperSkillAsync(skill);
            return Ok("Skill created successfully!");
        }

        [HttpPut("UpdateHousekeeperSkill")]
        [Authorize]
        public async Task<ActionResult> UpdateHousekeeperSkill([FromBody] HousekeeperSkillUpdateDTO housekeeperSkillUpdateDTO)
        {
            try
            {
                var existingSkill = await _housekeeperSkillService.GetHouseKeeperSkillByIDAsync(housekeeperSkillUpdateDTO.HouseKeeperSkillID);
                if (existingSkill == null)
                {
                    return NotFound("Skill not found!");
                }

                var updatedSkill = _mapper.Map(housekeeperSkillUpdateDTO, existingSkill);
                await _housekeeperSkillService.UpdateHouseKeeperSkillAsync(updatedSkill);
                return Ok("Skill updated successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteHousekeeperSkill")]
        [Authorize]
        public async Task<ActionResult> DeleteHousekeeperSkill([FromQuery] int id)
        {
            try
            {
                var skill = await _housekeeperSkillService.GetHouseKeeperSkillByIDAsync(id);
                if (skill == null)
                {
                    return NotFound("Skill not found!");
                }

                await _housekeeperSkillService.DeleteHouseKeeperSkillAsync(id);
                return Ok("Skill deleted successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}