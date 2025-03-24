using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

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
        [Authorize]
        public async Task<ActionResult<IEnumerable<FamilyDisplayDTO>>> GetAllFamilies(int pageNumber, int pageSize)
        {
            try
            {
                var families = await _familyService.GetAllFamilysAsync(pageNumber, pageSize);
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

        [HttpGet("GetFamilyByAccountID")]
        [Authorize]
        public async Task<ActionResult<FamilyDisplayDTO>> GetFamilyByAccountID([FromQuery] int id)
        {
            var account = await _accountService.GetAccountByIDAsync(id);
            if (account == null)
            {
                return NotFound("No account found!");
            }

            var family = await _familyService.GetFamilyByAccountIDAsync(account.AccountID);
            if (family == null)
            {
                return NotFound("No family found!");
            }

            var displayFamily = new FamilyDisplayDTO();
            _mapper.Map(family, displayFamily);
            _mapper.Map(account, displayFamily);

            return Ok(displayFamily);
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

            if (account.RoleID != 2)
            {
                return BadRequest("Only family can create profiles.");
            }
            var existingFamilies = await _familyService.GetAllFamilysAsync(1, 10);
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
        public async Task<IActionResult> UpdateFamily([FromForm] FamilyUpdateDTO familyDTO)
        {
            try
            {
                // Update Account
                var Acc = await _accountService.GetAccountByIDAsync(familyDTO.AccountID);
                if (Acc == null)
                {
                    return NotFound("No account found!");
                }

                if (familyDTO.LocalProfilePicture != null)
                {
                    byte[] pic;
                    using (var memoryStream = new MemoryStream())
                    {
                        await familyDTO.LocalProfilePicture.CopyToAsync(memoryStream);
                        pic = memoryStream.ToArray();
                    }
                }

                Acc.Phone = familyDTO.Phone;
                Acc.Introduction = familyDTO.Introduction;
                Acc.Name = familyDTO.Name;
                Acc.Email = familyDTO.Email;
                Acc.BankAccountNumber = familyDTO.BankAccountNumber;
                Acc.Address = familyDTO.Address;
                Acc.UpdatedAt = DateTime.Now;

                await _accountService.UpdateAccountAsync(Acc);

                var Family = await _familyService.GetFamilyByAccountIDAsync(familyDTO.AccountID);
                if (Family == null)
                {
                    return NotFound("No family profile found!");
                }

                Family.Nickname = familyDTO.Nickname;

                await _familyService.UpdateFamilyAsync(Family);

                return Ok("Family Profile Updated!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("SearchFamilyByAccountId")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FamilyDisplayDTO>>> SearchFamilyByAccountId([FromQuery] int accountId)
        {
            var families = await _familyService.SearchFamiliesByAccountIDAsync(accountId);

            if (families == null || !families.Any())
            {
                return NotFound("No families found for this account!");
            }

            var familyDTOs = _mapper.Map<List<FamilyDisplayDTO>>(families);
            return Ok(familyDTOs);
        }
    }
}