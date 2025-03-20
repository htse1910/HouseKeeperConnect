using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Interface;
using System.Transactions;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    public class IDVerificationsController : ControllerBase
    {
        private readonly IIDVerificationService _idVerificationService;
        private readonly IHouseKeeperService _houseKeeperService;
        private readonly IVerificationTaskService _verificationTaskService;
        private readonly IMapper _mapper;

        public IDVerificationsController(IIDVerificationService idVerificationService, IHouseKeeperService houseKeeperService, IVerificationTaskService verificationTaskService, IMapper mapper)
        {
            _idVerificationService = idVerificationService;
            _houseKeeperService = houseKeeperService;
            _verificationTaskService = verificationTaskService;
            _mapper = mapper;
        }

        [HttpGet("GetAllIDVerifications")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<IDVerificationDisplayDTO>>> GetAllIDVerifications()
        {
            try
            {
                var idVerifications = await _idVerificationService.GetAllIDVerifysAsync();
                if (idVerifications.Count == 0)
                {
                    return NotFound("No ID verifications found!");
                }

                var idVerificationDTOs = _mapper.Map<List<IDVerificationDisplayDTO>>(idVerifications);
                return Ok(idVerificationDTOs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetIDVerificationByID")]
        [Authorize]
        public async Task<ActionResult<IDVerificationDisplayDTO>> GetIDVerificationByID([FromQuery] int id)
        {
            var idVerification = await _idVerificationService.GetIDVerifyByIDAsync(id);
            if (idVerification == null)
            {
                return NotFound("ID Verification not found!");
            }

            var idVerificationDTO = _mapper.Map<IDVerificationDisplayDTO>(idVerification);
            return Ok(idVerificationDTO);
        }

        [HttpPost("CreateIDVerification")]
        public async Task<ActionResult> CreateIDVerification([FromForm] IDVerificationCreateDTO idVerificationDTO, [FromQuery] int housekeeperId)
        {
            if (idVerificationDTO == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var housekeeper = await _houseKeeperService.GetHousekeeperByIDAsync(housekeeperId);
                    if (housekeeper == null)
                    {
                        return NotFound("Housekeeper not found.");
                    }
                    if (housekeeper.VerifyID.HasValue)
                    {
                        return BadRequest("This Housekeeper already has an ID Verification.");
                    }

                    var frontPhotoTask = ConvertToByteArrayAsync(idVerificationDTO.FrontPhoto);
                    var backPhotoTask = ConvertToByteArrayAsync(idVerificationDTO.BackPhoto);
                    var facePhotoTask = ConvertToByteArrayAsync(idVerificationDTO.FacePhoto);

                    await Task.WhenAll(frontPhotoTask, backPhotoTask, facePhotoTask);

                    var idVerification = new IDVerification
                    {
                        IDNumber = idVerificationDTO.IDNumber,
                        RealName = idVerificationDTO.RealName,
                        DateOfBirth = idVerificationDTO.DateOfBirth,
                        FrontPhoto = await frontPhotoTask,
                        BackPhoto = await backPhotoTask,
                        FacePhoto = await facePhotoTask,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        Status = 1 // Pending
                    };

                    // Lưu IDVerification vào database trước
                    int verifyId = await _idVerificationService.AddIDVerifyAsync(idVerification);

                    if (verifyId == 0)
                    {
                        throw new Exception("Failed to create IDVerification.");
                    }

                    // Cập nhật VerifyID vào Housekeeper
                    housekeeper.VerifyID = verifyId;
                    await _houseKeeperService.UpdateHousekeeperAsync(housekeeper);

                    // Tạo VerificationTask
                    var verificationTask = new VerificationTask
                    {
                        VerifyID = verifyId,
                        AssignedDate = DateTime.UtcNow,
                        Status = 1 // Pending
                    };

                    await _verificationTaskService.CreateVerificationTaskAsync(verificationTask);

                    transaction.Complete(); // Commit transaction
                    return Ok(new { Message = "ID Verification created successfully!", VerifyID = verifyId });
                }
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, $"Database Error: {dbEx.InnerException?.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        private async Task<byte[]> ConvertToByteArrayAsync(IFormFile file)
        {
            if (file == null) return null;
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }

        [HttpPut("UpdateIDVerification")]
        public async Task<ActionResult> UpdateIDVerification([FromForm] IDVerificationUpdateDTO idVerificationDTO)
        {
            try
            {
                var existingVerification = await _idVerificationService.GetIDVerifyByIDAsync(idVerificationDTO.VerifyID);
                if (existingVerification == null)
                {
                    return NotFound("ID Verification not found!");
                }

                if (idVerificationDTO.FrontPhoto != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await idVerificationDTO.FrontPhoto.CopyToAsync(memoryStream);
                        existingVerification.FrontPhoto = memoryStream.ToArray();
                    }
                }

                if (idVerificationDTO.BackPhoto != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await idVerificationDTO.BackPhoto.CopyToAsync(memoryStream);
                        existingVerification.BackPhoto = memoryStream.ToArray();
                    }
                }

                if (idVerificationDTO.FacePhoto != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await idVerificationDTO.FacePhoto.CopyToAsync(memoryStream);
                        existingVerification.FacePhoto = memoryStream.ToArray();
                    }
                }

                existingVerification.IDNumber = idVerificationDTO.IDNumber;
                existingVerification.RealName = idVerificationDTO.RealName;
                existingVerification.DateOfBirth = idVerificationDTO.DateOfBirth;
                existingVerification.UpdatedAt = DateTime.UtcNow;

                await _idVerificationService.UpdateIDVerifyAsync(existingVerification);
                return Ok("ID Verification updated successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
    }
}