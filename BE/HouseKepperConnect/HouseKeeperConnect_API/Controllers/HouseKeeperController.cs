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
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private string Message;

        public HouseKeeperController(IHouseKeeperService housekeeperService, IAccountService accountService, IMapper mapper, IIDVerificationService verificationService, INotificationService notificationService)
        {
            _housekeeperService = housekeeperService;
            _accountService = accountService;
            _mapper = mapper;
            _verificationService = verificationService;
            _notificationService = notificationService;
        }

        [HttpGet("HousekeeperList")] //Admin
        [Authorize]
        public async Task<ActionResult<IEnumerable<HouseKeeperDisplayDTO>>> GetHousekeepersAsync(int pageNumber, int pageSize)
        {
            var trans = await _housekeeperService.GetAllHousekeepersAsync(pageNumber, pageSize);
            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var nTr = _mapper.Map<HouseKeeperDisplayDTO>(trans);
            return Ok(nTr);
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
        [Authorize(Policy ="Housekeeper")]
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
            var veri = new IDVerification();

            if (hk.VerifyID.HasValue)
            {
                veri = await _verificationService.GetIDVerifyByIDAsync(hk.VerifyID.Value);
            }

            var displayHK = new HouseKeeperDisplayDTO();

            _mapper.Map(hk, displayHK);
            _mapper.Map(acc, displayHK);
            _mapper.Map(veri, displayHK);

            return Ok(displayHK);
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

                var Acc = await _accountService.GetAccountByIDAsync(hk.AccountID);
                if (Acc == null)
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
                    Acc.LocalProfilePicture = pic;
                }

                Acc.Phone = newAcc.Phone;
                Acc.Introduction = newAcc.Introduction;
                Acc.Name = newAcc.Name;
                Acc.Email = newAcc.Email;
                Acc.BankAccountNumber = newAcc.BankAccountNumber;
                Acc.Address = newAcc.Address;
                Acc.UpdatedAt = DateTime.Now;

                await _accountService.UpdateAccountAsync(Acc);

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
        public async Task<IActionResult> GetPendingHousekeepers(int pageNumber, int pageSize)
        {
            var pendingHousekeepers = await _housekeeperService.GetPendingHousekeepersAsync(pageNumber, pageSize);
            var trans = _mapper.Map<List<HousekeeperPendingDTO>>(pendingHousekeepers);
            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(trans);
        }

        [HttpPost("update-verification-status")]
        [Authorize]
        public async Task<IActionResult> UpdateVerificationStatus([FromQuery] int housekeeperId, [FromQuery] bool isVerified)
        {
            try
            {
                var acc = await _housekeeperService.GetHousekeeperByIDAsync(housekeeperId);
                if (acc == null)
                {
                    Message = "Account not found!";
                    return NotFound(Message);
                }
                await _housekeeperService.UpdateIsVerifiedAsync(housekeeperId, isVerified);
                var noti = new Notification();
                noti.AccountID = acc.AccountID;
                if (isVerified == true)
                {
                    noti.Message = "Thông tin trắc học không hợp lệ, vui lòng kiểm tra lại!";
                }
                else
                {
                    noti.Message = "Thông tin trắc học xác nhận thành công!";
                }

                await _notificationService.AddNotificationAsync(noti);
                Message = "Tài khoản của bạn đã được xác nhận!";
                return Ok(Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}