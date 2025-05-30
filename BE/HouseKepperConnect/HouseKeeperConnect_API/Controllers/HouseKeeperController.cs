﻿using Appwrite;
using Appwrite.Models;
using Appwrite.Services;
using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using BusinessObject.Models.AppWrite;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.Interface;
using System.Diagnostics.CodeAnalysis;

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
        private readonly IVerificationTaskService _verificationTaskService;
        private readonly IHousekeeperSkillMappingService _housekeeperSkillMappingService;
        private readonly IConfiguration _configuration;
        private readonly Client _appWriteClient;
        private readonly IMapper _mapper;
        private string Message;

        public HouseKeeperController(IHouseKeeperService housekeeperService, IAccountService accountService, IMapper mapper,
            IIDVerificationService verificationService, INotificationService notificationService,
            IVerificationTaskService verificationTaskService, Client appWriteClient, IConfiguration configuration, IHousekeeperSkillMappingService housekeeperSkillMappingService)
        {
            _housekeeperService = housekeeperService;
            _accountService = accountService;
            _mapper = mapper;
            _verificationService = verificationService;
            _notificationService = notificationService;
            _verificationTaskService = verificationTaskService;
            _configuration = configuration;
            _housekeeperSkillMappingService = housekeeperSkillMappingService;
            AppwriteSettings appW = new AppwriteSettings()
            {
                ProjectId = configuration.GetValue<string>("Appwrite:ProjectId"),
                Endpoint = configuration.GetValue<string>("Appwrite:Endpoint"),
                ApiKey = configuration.GetValue<string>("Appwrite:ApiKey")
            };
            _appWriteClient = new Client().SetProject(appW.ProjectId).SetEndpoint(appW.Endpoint).SetKey(appW.ApiKey);
        }

        [HttpGet("HousekeeperDisplay")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<HouseKeeperDisplayDTO>>> GetHousekeepersAsync(int pageNumber, int pageSize)
        {
            var trans = await _housekeeperService.GetAllHousekeepersAsync(pageNumber, pageSize);
            if (trans == null)
            {
                Message = "Danh sách người giúp việc trống!";
                return NotFound(Message);
            }

            var nTr = new List<HouseKeeperDisplayDTO>();

            foreach (var item in trans)
            {
                if (item.VerifyID.HasValue)
                {
                    var skills = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(item.HousekeeperID);

                    var skillL = new List<SkillDisplayDTO>();

                    foreach (var skill in skills)
                    {
                        var nSkill = new SkillDisplayDTO();
                        nSkill.ID = skill.HouseKeeperSkillID;
                        nSkill.Name = skill.HouseKeeperSkill.Name;
                        skillL.Add(nSkill);
                    }

                    var nHk = new HouseKeeperDisplayDTO
                    {
                        HousekeeperID = item.HousekeeperID,
                        AccountID = item.AccountID,
                        Rating = item.Rating,
                        Address = item.Account.Address,
                        JobCompleted = item.JobCompleted,
                        BackPhoto = item.IDVerification.BackPhoto,
                        BankAccountNumber = item.Account.BankAccountNumber,
                        Email = item.Account.Email,
                        FacePhoto = item.IDVerification.FacePhoto,
                        FrontPhoto = item.IDVerification.FrontPhoto,
                        GoogleProfilePicture = item.Account.GoogleProfilePicture,
                        Introduction = item.Account.Introduction,
                        LocalProfilePicture = item.Account.LocalProfilePicture,
                        Skills = skillL,
                        VerifyID = item.VerifyID,
                        Name = item.Account.Name,
                        Phone = item.Account.Phone,
                        WorkType = item.WorkType,
                        Gender = item.Account.Gender.GetValueOrDefault(),
                        BankAccountName = item.Account.BankAccountName,
                    };
                    nTr.Add(nHk);
                }
                else
                {
                    var nHk = new HouseKeeperDisplayDTO
                    {
                        HousekeeperID = item.HousekeeperID,
                        AccountID = item.AccountID,
                        Address = item.Account.Address,
                        BankAccountNumber = item.Account.BankAccountNumber,
                        Email = item.Account.Email,
                        JobCompleted = item.JobCompleted,
                        GoogleProfilePicture = item.Account.GoogleProfilePicture,
                        Introduction = item.Account.Introduction,
                        LocalProfilePicture = item.Account.LocalProfilePicture,
                        Name = item.Account.Name,
                        Phone = item.Account.Phone,
                        WorkType = item.WorkType,
                        Gender = item.Account.Gender.GetValueOrDefault(),
                    };
                    nTr.Add(nHk);
                }
            }

            return Ok(nTr);
        }

        [HttpGet("CountVerifiedHouskeeper")]
        [Authorize]
        public async Task<ActionResult<int>> CountVerifiedHKAsync()
        {
            var count = await _housekeeperService.CountVerifiedHousekeepersAsync();
            if (count == 0)
            {
                Message = "Danh sách người giúp việc đã duyệt trống!";
                return NotFound(Message);
            }

            return Ok(count);
        }

        [HttpGet("CountPendingHouskeeper")]
        [Authorize]
        public async Task<ActionResult<int>> CountPendingHKAsync()
        {
            var count = await _housekeeperService.CountPendingHousekeepersAsync();
            if (count == 0)
            {
                Message = "Danh sách người giúp việc đang chờ duyệt trống!";
                return NotFound(Message);
            }

            return Ok(count);
        }

        [HttpGet("HousekeeperList")] //Admin
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<IEnumerable<HousekeeperListDTO>>> GetListHousekeepersAsync(int pageNumber, int pageSize)
        {
            var trans = await _housekeeperService.GetAllHousekeepersAsync(pageNumber, pageSize);
            if (trans == null)
            {
                Message = "Danh sách người giúp việc trống!";
                return NotFound(Message);
            }

            var nTr = new List<HousekeeperListDTO>();

            foreach (var item in trans)
            {
                var nHk = new HousekeeperListDTO
                {
                    HousekeeperID = item.HousekeeperID,
                    Nickname = item.Account.Nickname,
                    Address = item.Account.Address,
                    Phone = item.Account.Phone,
                    Email = item.Account.Email,
                    Gender = item.Account.Gender.GetValueOrDefault(),
                    WorkType = item.WorkType,
                    Rating = item.Rating,
                    LocalProfilePicture = item.Account.LocalProfilePicture,
                };
                nTr.Add(nHk);
            }
            return Ok(nTr);
        }

        [HttpGet("GetHousekeeperByID")]
        [Authorize]
        public async Task<ActionResult<HouseKeeperDisplayDTO>> getHKByID([FromQuery] int id)
        {
            var hk = await _housekeeperService.GetHousekeeperByIDAsync(id);
            if (hk == null)
            {
                Message = "Không tìm thấy người giúp việc!";
                return NotFound(Message);
            }
            var acc = await _accountService.GetAccountByIDAsync(hk.AccountID);
            if (acc == null)
            {
                Message = "Không tìm thấy tài khoản!";
                return NotFound(Message);
            }
            var veri = new IDVerification();

            if (hk.VerifyID.HasValue)
            {
                veri = await _verificationService.GetIDVerifyByIDAsync(hk.VerifyID.Value);
            }
            var display = new HouseKeeperDisplayDTO();
            _mapper.Map(acc, display);
            _mapper.Map(hk, display);
            _mapper.Map(veri, display);
            return Ok(display);
        }

        [HttpGet("GetHousekeeperByAccountID")]
        [Authorize]
        public async Task<ActionResult<HouseKeeperDisplayDTO>> getHKByAccountID([FromQuery] int id)
        {
            var acc = await _accountService.GetAccountByIDAsync(id);

            if (acc == null)
            {
                Message = "Không tìm thấy tài khoản!";
                return NotFound(Message);
            }
            var hk = await _housekeeperService.GetHousekeeperByUserAsync(acc.AccountID);
            if (hk == null)
            {
                Message = "Không tìm thấy người giúp việc!";
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

            var skills = await _housekeeperSkillMappingService.GetSkillsByHousekeeperIdAsync(hk.HousekeeperID);

            var skillL = new List<SkillDisplayDTO>();

            foreach (var skill in skills)
            {
                var nSkill = new SkillDisplayDTO();
                nSkill.ID = skill.HouseKeeperSkillID;
                nSkill.Name = skill.HouseKeeperSkill.Name;
                skillL.Add(nSkill);
            }

            displayHK.Skills = skillL;

            return Ok(displayHK);
        }

        [HttpPost("AddHousekeeper")]
        [Authorize(Policy = "Admin")]
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
                var newAcc = _mapper.Map<BusinessObject.Models.Account>(hk);

                var Acc = await _accountService.GetAccountByIDAsync(hk.AccountID);
                if (Acc == null)
                {
                    Message = "Không tìm thấy tài khoản!";
                    return NotFound(Message);
                }
                if (hk.LocalProfilePicture == null)
                {

                }
                else
                {
                    var storage = new Storage(_appWriteClient);
                    var buckID = "67e3d029000d5b9dd68e";
                    var projectID = _configuration.GetValue<string>("Appwrite:ProjectId");

                    List<string> perms = new List<string>() { Permission.Write(Appwrite.Role.Any()), Permission.Read(Appwrite.Role.Any()) };
                    var idFr = Guid.NewGuid().ToString();
                    var avatar = InputFile.FromStream(
                        hk.LocalProfilePicture.OpenReadStream(),
                        hk.LocalProfilePicture.FileName,
                        hk.LocalProfilePicture.ContentType
                        );
                    var response = await storage.CreateFile(
                                buckID,
                                idFr,
                                avatar,
                                perms,
                                null
                                );

                    var avatarID = response.Id;
                    var avatarUrl = $"{_appWriteClient.Endpoint}/storage/buckets/{response.BucketId}/files/{avatarID}/view?project={projectID}";
                    Acc.LocalProfilePicture = avatarUrl;
                }

                Acc.Phone = newAcc.Phone;
                Acc.Introduction = newAcc.Introduction;
                Acc.Name = newAcc.Name;
                Acc.BankAccountNumber = newAcc.BankAccountNumber;
                Acc.Address = newAcc.Address;
                Acc.UpdatedAt = DateTime.Now;
                Acc.Gender = newAcc.Gender;
                Acc.Nickname = newAcc.Nickname;
                Acc.BankAccountName = newAcc.BankAccountName;

                await _accountService.UpdateAccountAsync(Acc);

                //<--------------------------------------------------------------------------------->// Update Housekeeper
                var newHK = _mapper.Map<Housekeeper>(hk);

                var oHk = await _housekeeperService.GetHousekeeperByUserAsync(newHK.AccountID);

                if (oHk == null)
                {
                    Message = "Không tìm thấy người giúp việc!";
                    return NotFound(Message);
                }

                /*var id = await _verificationService.GetIDVerifyByIDAsync(oHk.VerifyID.Value);

                if (id != null)
                {
                    id.UpdatedAt = DateTime.Now;
                    await _verificationService.UpdateIDVerifyAsync(id);
                    oHk.VerifyID = id.VerifyID;
                }
                else
                {
                    var nId = new IDVerification();

                    nId.Status = (int)VerificationStatus.Pending;
                    nId.CreatedAt = DateTime.Now;
                    nId.UpdatedAt = DateTime.Now;
                    *//*nId.FrontPhoto = nFront;
                    nId.FacePhoto = nFace;
                    nId.BackPhoto = nBack;*//*

                    await _verificationService.AddIDVerifyAsync(nId);
                    oHk.VerifyID = nId.VerifyID;
                }*/

                oHk.WorkType = newHK.WorkType;

                await _housekeeperService.UpdateHousekeeperAsync(oHk);
                Message = "Cập nhật người giúp việc thành công!";
                return Ok(Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("ListHousekeeperIDPending")]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> GetPendingHousekeepers(int pageNumber, int pageSize)
        {
            var pendingHousekeepers = await _housekeeperService.GetPendingHousekeepersAsync(pageNumber, pageSize);
            if (pendingHousekeepers.Count == 0)
            {
                return NotFound("Danh sách người giúp việc chờ duyệt trống!");
            }

            var pendingList = new List<HousekeeperPendingDTO>();
            foreach (var hk in pendingHousekeepers)
            {
                var task = await _verificationTaskService.GetTaskByVerificationIdAsync(hk.IDVerification.VerifyID);
                var pendingListDTO = new HousekeeperPendingDTO()
                {
                    HousekeeperID = hk.HousekeeperID,
                    Name = hk.Account.Name,
                    Nickname = hk.Account.Nickname,
                    Gender = hk.Account.Gender.GetValueOrDefault(),
                    VerifyID = hk.IDVerification.VerifyID,
                    TaskID = task?.TaskID,
                    FrontPhoto = hk.IDVerification.FrontPhoto,
                    FacePhoto = hk.IDVerification.FacePhoto,
                    BackPhoto = hk.IDVerification.BackPhoto,
                    Status = hk.IDVerification.Status,
                };

                pendingList.Add(pendingListDTO);
            }

            return Ok(pendingList);
        }

        [HttpPost("UpdateVerificationStatus")]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> UpdateVerificationStatus([FromQuery] int housekeeperId, [FromQuery] bool isVerified)
        {
            try
            {
                var acc = await _housekeeperService.GetHousekeeperByIDAsync(housekeeperId);
                if (acc == null)
                {
                    Message = "Không tìm thấy người giúp việc!";
                    return NotFound(Message);
                }
                await _housekeeperService.UpdateIsVerifiedAsync(housekeeperId, isVerified);
                var noti = new Notification();
                noti.AccountID = acc.AccountID;
                if (isVerified == true)
                {
                    noti.Message = "Thông tin không hợp lệ, hãy kiểm tra lại!";
                }
                else
                {
                    noti.Message = "Phê duyệt thành công!";
                }

                await _notificationService.AddNotificationAsync(noti);
                Message = "Tài khoản của bạn đã được phê duyệt!";
                return Ok(Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}