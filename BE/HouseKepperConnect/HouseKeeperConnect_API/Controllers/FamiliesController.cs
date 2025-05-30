﻿using Appwrite;
using Appwrite.Models;
using Appwrite.Services;
using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.AppWrite;
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
        private readonly IConfiguration _configuration;
        private readonly Client _appWriteClient;

        public FamiliesController(IFamilyProfileService familyService, IAccountService accountService, IMapper mapper, Client appWriteClient, IConfiguration configuration)
        {
            _familyService = familyService;
            _accountService = accountService;
            _mapper = mapper;
            _configuration = configuration;
            _appWriteClient = appWriteClient;
        }

        [HttpGet("FamilyList")]
        [Authorize(Policy ="Admin")]
        public async Task<ActionResult<IEnumerable<FamilyDisplayDTO>>> GetAllFamilies(int pageNumber, int pageSize)
        {
            var families = await _familyService.GetAllFamilysAsync(pageNumber, pageSize);
            if (families.Count == 0)
            {
                return NotFound("Danh sách gia đình trống!");
            }

            var familyList = new List<FamilyDisplayDTO>();

            foreach (var item in families)
            {
                var familyDTO = new FamilyDisplayDTO
                {
                    AccountID = item.AccountID,
                    Address = item.Account.Address,
                    BankAccountNumber = item.Account.BankAccountNumber,
                    Email = item.Account.Email,
                    GoogleProfilePicture = item.Account.GoogleProfilePicture,
                    Introduction = item.Account.Introduction,
                    LocalProfilePicture = item.Account.LocalProfilePicture,
                    Name = item.Account.Name,
                    Phone = item.Account.Phone,
                    Gender = item.Account.Gender.GetValueOrDefault(),
                    BankAccountName = item.Account.BankAccountName,
                };

                familyList.Add(familyDTO);
            }
            return Ok(familyList);
        }

        [HttpGet("GetFamilyByID")]
        [Authorize]
        public async Task<ActionResult<Family>> GetFamilyById([FromQuery] int id)
        {
            var family = await _familyService.GetFamilyByIDAsync(id);
            if (family == null)
            {
                return NotFound("Không tìm thấy gia đình!");
            }

            //var familyDTO = _mapper.Map<FamilyDisplayDTO>(family);
            return Ok(family);
        }

        [HttpGet("GetFamilyByAccountID")]
        [Authorize]
        public async Task<ActionResult<FamilyDisplayDTO>> GetFamilyByAccountID([FromQuery] int id)
        {
            var account = await _accountService.GetAccountByIDAsync(id);
            if (account == null)
            {
                return NotFound("Không tìm thấy thông tin tài khoản!");
            }

            var family = await _familyService.GetFamilyByAccountIDAsync(account.AccountID);
            if (family == null)
            {
                return NotFound("Không tìm thấy thông tin gia đình!");
            }

            var displayFamily = new FamilyDisplayDTO();
            _mapper.Map(family, displayFamily);
            _mapper.Map(account, displayFamily);

            return Ok(displayFamily);
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
        [Authorize(Policy ="Admin")]
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
                    return NotFound("Không tìm thấy tài khoản!");
                }

                if (familyDTO.LocalProfilePicture != null)
                {
                    var storage = new Storage(_appWriteClient);
                    var bucketId = "67e3d029000d5b9dd68e"; 

                    List<string> perms = new List<string>()
            {
                Permission.Write(Appwrite.Role.Any()),
                Permission.Read(Appwrite.Role.Any())
            };

                    var fileId = Guid.NewGuid().ToString();
                    var avatar = InputFile.FromStream(
                        familyDTO.LocalProfilePicture.OpenReadStream(),
                        familyDTO.LocalProfilePicture.FileName,
                        familyDTO.LocalProfilePicture.ContentType
                    );

                    var response = await storage.CreateFile(bucketId, fileId, avatar, perms, null);

                    var projectID = _configuration.GetValue<string>("Appwrite:ProjectId");
                    var avatarUrl = $"{_appWriteClient.Endpoint}/storage/buckets/{response.BucketId}/files/{response.Id}/view?project={projectID}";

                    Acc.LocalProfilePicture = avatarUrl;
                }

                Acc.Phone = familyDTO.Phone;
                Acc.Introduction = familyDTO.Introduction;
                Acc.Name = familyDTO.Name;    
                Acc.BankAccountNumber = familyDTO.BankAccountNumber;
                Acc.Address = familyDTO.Address;
                Acc.UpdatedAt = DateTime.Now;
                Acc.Gender = familyDTO.Gender;
                Acc.Nickname = familyDTO.Nickname;
                Acc.BankAccountName = familyDTO.BankAccountName;

                await _accountService.UpdateAccountAsync(Acc);

                var Family = await _familyService.GetFamilyByAccountIDAsync(familyDTO.AccountID);
                if (Family == null)
                {
                    return NotFound("Không tìm thấy gia đình!");
                }

                await _familyService.UpdateFamilyAsync(Family);

                return Ok("Thông tin gia đình cập nhật thành công!");
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
                return NotFound("Không tìm thấy gia đình liên kết với tài khoản này!");
            }

            var familyDTOs = _mapper.Map<List<FamilyDisplayDTO>>(families);
            return Ok(familyDTOs);
        }
    }
}