using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HouseKeeperController : ControllerBase
    {
        private readonly IHouseKeeperService _housekeeperService;
        private readonly IAccountService _accountService;
        private readonly IIDVerificationService _verificationService;
        private readonly IMapper _mapper;
        private string Message;

        public HouseKeeperController(IHouseKeeperService housekeeperService, IAccountService accountService, IMapper mapper, IIDVerificationService verificationService)
        {
            _housekeeperService = housekeeperService;
            _accountService = accountService;
            _mapper = mapper;
            _verificationService = verificationService;
        }

        [HttpGet("HousekeeperList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Housekeeper>>> GetHousekeepersAsync()
        {
            var trans = await _housekeeperService.GetAllHousekeepersAsync();
            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(trans);
        }

        [HttpGet("GetHousekeeperByID")]
        [Authorize]
        public async Task<ActionResult<Housekeeper>> getHKByID([FromQuery] int id)
        {
            var hk = await _housekeeperService.GetHousekeeperByIDAsync(id);
            if (hk == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            return Ok(hk);
        }

        [HttpGet("GetHousekeeperByAccountID")]
        [Authorize]
        public async Task<ActionResult<HouseKeeperDisplayDTO>> getHKByAccountID([FromQuery] int id)
        {
            var acc = await _accountService.GetAccountByIDAsync(id);

            if (acc == null)
            {
                Message = "No account found!";
                return NotFound(Message);
            }
            var hk = await _housekeeperService.GetHousekeeperByUserAsync(acc.AccountID);
            if (hk == null)
            {
                Message = "No housekeeper found!";
                return NotFound(Message);
            }

            var veri = await _verificationService.GetIDVerifyByIDAsync(hk.VerifyID.Value);

            var displayHK = new HouseKeeperDisplayDTO();
            _mapper.Map(hk, displayHK);
            _mapper.Map(acc, displayHK);
            _mapper.Map(veri, displayHK);

            return Ok(displayHK);
        }

        [HttpGet("GetHousekeeperListByAccountID")] //Admin
        [Authorize]
        public async Task<ActionResult<IEnumerable<Housekeeper>>> getHkByUserID([FromQuery] int id)
        {
            var trans = await _housekeeperService.GetHousekeeperByUserAsync(id);
            if (trans == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            return Ok(trans);
        }

        [HttpPost("AddHousekeeper")]
        [Authorize]
        public async Task<ActionResult<Housekeeper>> addHK([FromQuery] HouseKeeperCreateDTO hk)
        {
            var oHk = _mapper.Map<Housekeeper>(hk);
            var acc = await _accountService.GetAccountByIDAsync(hk.AccountID);
            if (acc == null)
            {
                Message = "No account found!";
                return NotFound(Message);
            }

            var housek = await _housekeeperService.GetHousekeeperByUserAsync(acc.AccountID);
            if (housek != null)
            {
                Message = "Account already had this permission!";
                return BadRequest(Message);
            }

            /*            var id = new IDVerification();

                        byte[] front, face, back;

                        using (var memoryStream = new MemoryStream())
                        {
                            await hk.FrontPhoto.CopyToAsync(memoryStream);
                            front = memoryStream.ToArray();
                        }
                        using (var memoryStream = new MemoryStream())
                        {
                            await hk.FacePhoto.CopyToAsync(memoryStream);
                            face = memoryStream.ToArray();
                        }
                        using (var memoryStream = new MemoryStream())
                        {
                            await hk.BackPhoto.CopyToAsync(memoryStream);
                            back = memoryStream.ToArray();
                        }

                        id.Status = (int)VerificationStatus.Pending;
                        id.CreatedAt = DateTime.Now;
                        id.UpdatedAt = DateTime.Now;
                        id.FrontPhoto = front;
                        id.FacePhoto = face;
                        id.BackPhoto = back;

                        await _verificationService.AddIDVerifyAsync(id);*/

            oHk.VerifyID = null;

            await _housekeeperService.AddHousekeeperAsync(oHk);
            Message = "Added!";
            return Ok(Message);
        }

        [HttpPut("UpdateHousekeeper")]
        [Authorize]
        public async Task<ActionResult<Housekeeper>> UpdateHousekeeper([FromForm] HouseKeeperUpdateDTO hk)
        {
            try
            {
                //<--------------------------------------------------------------------------------->// Update Account
                var newAcc = _mapper.Map<Account>(hk);

                var oAcc = await _accountService.GetAccountByIDAsync(hk.AccountID);
                if (oAcc == null)
                {
                    Message = "No account found!";
                    return NotFound(Message);
                }

                if (hk.LocalProfilePicture != null)
                {
                    byte[] pic;
                    using (var memoryStream = new MemoryStream())
                    {
                        await hk.LocalProfilePicture.CopyToAsync(memoryStream);
                        pic = memoryStream.ToArray();
                    }
                    oAcc.LocalProfilePicture = pic;
                }

                oAcc.Phone = newAcc.Phone;
                oAcc.Introduction = newAcc.Introduction;
                oAcc.Name = newAcc.Name;
                oAcc.Email = newAcc.Email;
                oAcc.BankAccountNumber = newAcc.BankAccountNumber;
                oAcc.Address = newAcc.Address;
                oAcc.UpdatedAt = DateTime.Now;

                await _accountService.UpdateAccountAsync(oAcc);

                //<--------------------------------------------------------------------------------->// Update Housekeeper
                var newHK = _mapper.Map<Housekeeper>(hk);

                var oHk = await _housekeeperService.GetHousekeeperByUserAsync(newHK.AccountID);

                if (oHk == null)
                {
                    Message = "No housekeeper found!";
                    return NotFound(Message);
                }

                var id = await _verificationService.GetIDVerifyByIDAsync(oHk.VerifyID.Value);

                if (id != null)
                {
                    byte[] front, face, back;

                    // ✅ Read uploaded images
                    if (hk.FrontPhoto != null)
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await hk.FrontPhoto.CopyToAsync(memoryStream);
                            front = memoryStream.ToArray();
                        }
                        id.FrontPhoto = front;
                    }

                    if (hk.FacePhoto != null)
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await hk.FacePhoto.CopyToAsync(memoryStream);
                            face = memoryStream.ToArray();
                        }
                        id.FacePhoto = face;
                    }

                    if (hk.BackPhoto != null)
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await hk.BackPhoto.CopyToAsync(memoryStream);
                            back = memoryStream.ToArray();
                        }
                        id.BackPhoto = back;
                    }

                    id.UpdatedAt = DateTime.Now;
                    await _verificationService.UpdateIDVerifyAsync(id);
                    oHk.VerifyID = id.VerifyID;
                }
                else
                {
                    var nId = new IDVerification();

                    byte[] nFront, nFace, nBack;

                    using (var memoryStream = new MemoryStream())
                    {
                        await hk.FrontPhoto.CopyToAsync(memoryStream);
                        nFront = memoryStream.ToArray();
                    }
                    using (var memoryStream = new MemoryStream())
                    {
                        await hk.FacePhoto.CopyToAsync(memoryStream);
                        nFace = memoryStream.ToArray();
                    }
                    using (var memoryStream = new MemoryStream())
                    {
                        await hk.BackPhoto.CopyToAsync(memoryStream);
                        nBack = memoryStream.ToArray();
                    }

                    nId.Status = (int)VerificationStatus.Pending;
                    nId.CreatedAt = DateTime.Now;
                    nId.UpdatedAt = DateTime.Now;
                    nId.FrontPhoto = nFront;
                    nId.FacePhoto = nFace;
                    nId.BackPhoto = nBack;

                    await _verificationService.AddIDVerifyAsync(nId);
                    oHk.VerifyID = nId.VerifyID;
                }

                await _housekeeperService.UpdateHousekeeperAsync(oHk);
                Message = "Housekeeper Updated!";
                return Ok(Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("ListHousekeeperPending")]
        [Authorize]
        public async Task<IActionResult> GetPendingHousekeepers()
        {
            var pendingHousekeepers = await _housekeeperService.GetPendingHousekeepersAsync();
            var trans = _mapper.Map<List<HousekeeperPendingDTO>>(pendingHousekeepers);
            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(trans);
        }

        [HttpPost("update-verification-status")]
        public async Task<IActionResult> UpdateVerificationStatus([FromQuery] int housekeeperId, [FromQuery] bool isVerified)
        {
            try
            {
                await _housekeeperService.UpdateIsVerifiedAsync(housekeeperId, isVerified);
                return Ok("Verification status updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}