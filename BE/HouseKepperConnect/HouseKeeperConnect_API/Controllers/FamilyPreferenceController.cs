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
    public class FamilyPreferenceController : ControllerBase
    {
        private readonly IFamilyPreferenceService _familyPreferenceService;
        private readonly IMapper _mapper;

        public FamilyPreferenceController(IFamilyPreferenceService familyPreferenceService, IMapper mapper)
        {
            _familyPreferenceService = familyPreferenceService;
            _mapper = mapper;
        }

        [HttpGet("GetFamilyPreferenceByFamilyID")]
        [Authorize]
        public async Task<ActionResult<FamilyPreference>> GetByFamilyID([FromQuery] int familyId)
        {
            var preference = await _familyPreferenceService.GetPreferenceByFamilyIDAsync(familyId);
            if (preference == null)
                return NotFound("No preference found.");

            return Ok(preference);
        }

        [HttpPost("AddFamilyPreference")]
        [Authorize]
        public async Task<ActionResult> AddPreference([FromBody] FamilyPreferenceCreateDTO preferenceDTO)
        {
            var exists = await _familyPreferenceService.GetPreferenceByFamilyIDAsync(preferenceDTO.FamilyID);
            if (exists != null)
                return Conflict("Family already has a preference.");

            var preference = _mapper.Map<FamilyPreference>(preferenceDTO);
            await _familyPreferenceService.AddFamilyPreferenceAsync(preference);

            return Ok("Family preference created successfully.");
        }

        [HttpPut("UpdateFamilyPreference")]
        [Authorize]
        public async Task<ActionResult> UpdatePreference([FromBody] FamilyPreferenceUpdateDTO preferenceDTO)
        {
            var preference = await _familyPreferenceService.GetPreferenceByIDAsync(preferenceDTO.FamilyPreferenceID);
            if (preference == null)
                return NotFound("Preference not found.");

            _mapper.Map(preferenceDTO, preference);
            await _familyPreferenceService.UpdateFamilyPreferenceAsync(preference);

            return Ok("Family preference updated successfully.");
        }

        [HttpDelete("DeleteFamilyPreference")]
        [Authorize]
        public async Task<ActionResult> DeletePreference([FromQuery] int id)
        {
            var preference = await _familyPreferenceService.GetPreferenceByIDAsync(id);
            if (preference == null)
                return NotFound("Preference not found.");

            await _familyPreferenceService.DeleteFamilyPreferenceAsync(id);
            return Ok("Family preference deleted successfully.");
        }
    }
}
