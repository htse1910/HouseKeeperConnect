using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BusinessObject.Models;
using Services.Interface;
using AutoMapper;
using BusinessObject.DTO;
using Microsoft.AspNetCore.Authorization;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    public class FamiliesController : ControllerBase
    {
        private readonly IFamilyProfileService _familyService;
        private readonly IAccountService _accountService;
        private string Message;
        private readonly IMapper _mapper;

        public FamiliesController(IFamilyProfileService familyService, IAccountService accountService, IMapper mapper)
        {
            _familyService = familyService;
            _accountService = accountService;
            _mapper = mapper;
        }

        [HttpGet("FamilyList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<FamilyDisplayDTO>>> GetAllFamilies()
        {
            try
            {
                var families = await _familyService.GetAllFamilysAsync();
                if (families.Count == 0)
                {
                    return NotFound("Family list is empty!");
                }

                var familyDTOs = _mapper.Map<List<FamilyDisplayDTO>>(families);
                return Ok(familyDTOs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetFamily")]
        [Authorize]
        public async Task<ActionResult<FamilyDisplayDTO>> GetFamilyById([FromQuery] int id)
        {
            var family = await _familyService.GetFamilyByIDAsync(id);
            if (family == null)
            {
                return NotFound("Family not found!");
            }

            var familyDTO = _mapper.Map<FamilyDisplayDTO>(family);
            return Ok(familyDTO);
        }

        [HttpGet("SearchFamily")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FamilyDisplayDTO>>> SearchFamiliesByName([FromQuery] string name)
        {
            var families = await _familyService.SearchFamilysByNameAsync(name);
            var familyDTOs = _mapper.Map<List<FamilyDisplayDTO>>(families);

            if (familyDTOs.Count == 0)
            {
                Message = "No families found!";
                return NotFound(Message);
            }
            return Ok(familyDTOs);
        }


        [HttpPost("AddFamilyProfile")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult<string>> AddFamilyProfile(AddFamilyProfileDTO familyDTO)
        {
            var account = await _accountService.GetAccountByIDAsync(familyDTO.AccountID);

            if (account == null)
            {
                return NotFound("Account not found!");
            }

            if (account.RoleID!= 2)
            {
                return BadRequest("Only family can create profiles.");
            }
            var existingFamilies = await _familyService.GetAllFamilysAsync();
            var existingFamily = existingFamilies.FirstOrDefault(f => f.AccountID == familyDTO.AccountID);

            if (existingFamily != null)
            {
                return BadRequest("This account already has a family profile. Only one family profile per account is allowed.");
            }
            var family = _mapper.Map<Family>(familyDTO);
            await _familyService.AddFamilyAsync(family);

            return Ok("Family profile added successfully!");
        }

        [HttpDelete("DeleteFamily")]
        [Authorize]
        public async Task<IActionResult> DeleteFamily([FromQuery] int id)
        {
            var family = await _familyService.GetFamilyByIDAsync(id);
            if (family == null)
            {
                return NotFound("Family profile not found!");
            }

            await _familyService.DeleteFamilyAsync(id);
            return Ok("Family Profile Deleted!");
        }

        [HttpPut("UpdateFamily")]
        [Authorize]
        public async Task<IActionResult> UpdateFamily([FromQuery] FamilyUpdateDTO familyDTO)
        {
            var family = await _familyService.GetFamilyByIDAsync(familyDTO.Id);
            if (family == null)
            {
                return NotFound("Family profile not found!");
            }

            _mapper.Map(familyDTO, family);

            await _familyService.UpdateFamilyAsync(family);
            return Ok("Family Profile Updated!");
        }


    }
}
