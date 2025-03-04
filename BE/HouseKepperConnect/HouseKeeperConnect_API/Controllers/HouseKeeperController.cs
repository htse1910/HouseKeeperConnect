using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IMapper _mapper;
        private string Message;

        public HouseKeeperController(IHouseKeeperService housekeeperService, IAccountService accountService, IMapper mapper)
        {
            _housekeeperService = housekeeperService;
            _accountService = accountService;
            _mapper = mapper;
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
        public async Task<ActionResult<IEnumerable<Housekeeper>>> getTransByUserID([FromQuery] int id)
        {
            var trans = await _housekeeperService.GetHousekeepersByUserAsync(id);
            if (trans == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            return Ok(trans);
        }

        [HttpPost("AddHousekeeper")]
        [Authorize]
        public async Task<ActionResult<Housekeeper>> addHK([FromQuery] HouseKeeperCreateDTO hk, [FromQuery] IDVerificationDTO veri)
        {
            var nHk = _mapper.Map<Housekeeper>(hk);
            var acc = await _accountService.GetAccountByIDAsync(hk.AccountID);
            if(acc == null)
            {
                Message = "No account found!";
                return NotFound(Message);
            }

            var housek = await _housekeeperService.GetHousekeepersByUserAsync(acc.AccountID);
            if(housek != null)
            {
                Message = "Account already had this permission!";
                return BadRequest(Message);
            }

            var id = _mapper.Map<IDVerification>(veri);

            id.Status = (int)VerificationStatus.Pending;
            id.CreatedAt = DateTime.Now;
            id.UpdatedAt = DateTime.Now;


            nHk.IsVerified = false;
            nHk.JobCompleted = 0;
            nHk.JobsApplied = 0;
            nHk.BankAccountNumber = "";
            nHk.HouseKeeperSkillID = 1;
            nHk.VerifyID = id.VerifyID;

            await _housekeeperService.AddHousekeeperAsync(nHk);
            Message = "Added!";
            return Ok(Message);

        }

        [HttpPut("UpdateHousekeeper")]
        [Authorize]
        public async Task<ActionResult<Housekeeper>> UpdateHousekeeper([FromQuery] HouseKeeperUpdateDTO hk)
        {
            var newAcc = _mapper.Map<Housekeeper>(hk);
            var acc = await _housekeeperService.GetHousekeepersByUserAsync(hk.AccountID);

            if (acc == null)
            {
                Message = "No account found!";
                return NotFound(Message);
            }

            await _housekeeperService.UpdateHousekeeperAsync(newAcc);
            Message = "Housekeeper Updated!";
            return Ok(Message);


        }
    }
}
