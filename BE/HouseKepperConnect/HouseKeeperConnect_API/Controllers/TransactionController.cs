using BusinessObject.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using System.Transactions;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private string Message;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet("TransactionList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsAsync()
        {
            var trans = await _transactionService.GetAllTransactionsAsync();
            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(trans);
        }

        [HttpGet("TransactionInPastWeek")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransInPastWeek()
        {
            var trans = await _transactionService.GetTransactionsPastWeekAsync();
            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(trans);
        }

        [HttpGet("GetTotalTransactions")]
        [Authorize]
        public async Task<ActionResult<int>> GetTotalTrans()
        {
            var num = await _transactionService.GetTotalTransAsync();
            if (num == 0)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(num);
        }

        [HttpGet("GetTransactionByID")]
        [Authorize]
        public async Task<ActionResult<Transaction>> getTransByID([FromQuery] int id)
        {
            var trans = await _transactionService.GetTransactionByIDAsync(id);
            if (trans == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            return Ok(trans);
        }

        [HttpGet("GetTransactionByUserID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Transaction>>> getTransByUserID([FromQuery] int id)
        {
            var trans = await _transactionService.GetTransactionsByUserAsync(id);
            if (trans == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            return Ok(trans);
        }

        [HttpPut("UpdateTransaction")] //Staff Only
        [Authorize]
        public async Task<ActionResult<Transaction>> UpdateTransaction([FromQuery] TransactionUpdateDTO transactionUpdateDTO)
        {
            var trans = await _transactionService.GetTransactionByIDAsync(transactionUpdateDTO.TransactionID);

            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            trans.Status = transactionUpdateDTO.Status;

            await _transactionService.UpdateTransactionAsync(trans);
            Message = "Transaction Updated!";
            return Ok(Message);
        }
    }
}