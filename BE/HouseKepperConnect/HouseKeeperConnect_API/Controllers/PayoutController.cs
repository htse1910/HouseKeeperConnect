using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayoutController : ControllerBase
    {
        private readonly IPayoutService _payoutService;
        private string Message;

        public PayoutController(IPayoutService payoutService)
        {
            _payoutService = payoutService;
        }

        [HttpGet("PayoutList")]
        [Authorize("Admin")]
        public async Task<ActionResult<List<Payout>>> GetPayoutList([FromQuery] int pageNumber, int pageSize)
        {
            var list = await _payoutService.GetAllPayoutsAsync(pageNumber, pageSize);
            if(list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(list);
        }

        [HttpGet("GetPayoutsByHK")]
        [Authorize(Policy ="Housekeeper")]
        public async Task<ActionResult<List<Payout>>> GetPayoutsByHK([FromQuery]int accountID, int pageNumber, int pageSize)
        {
            var list = await _payoutService.GetPayoutsByHKAsync(accountID, pageNumber, pageSize);
            if(list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            return Ok(list);
        }
    }
}
