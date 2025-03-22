using AutoMapper;
using BusinessObject.DTO;
using BusinessObject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IMapper _mapper;
        private string Message;

        public TransactionController(ITransactionService transactionService, IMapper mapper)
        {
            _transactionService = transactionService;
            _mapper = mapper;
        }

        [HttpGet("TransactionList")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsAsync(int pageNumber, int pageSize)
        {
            var trans = await _transactionService.GetAllTransactionsAsync(pageNumber, pageSize);
            if (trans == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(trans);
        }

        [HttpGet("TransactionInPastWeek")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransInPastWeek(int pageNumber, int pageSize)
        {
            var trans = await _transactionService.GetTransactionsPastWeekAsync(pageNumber, pageSize);
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
        public async Task<ActionResult<TransactionDisplayDTO>> getTransByID([FromQuery] int id)
        {
            var trans = await _transactionService.GetTransactionByIDAsync(id);
            if (trans == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            var nTra = _mapper.Map<TransactionDisplayDTO>(trans);
            return Ok(nTra);
        }

        [HttpGet("GetTransactionByUserID")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TransactionDisplayDTO>>> getTransByUserID([FromQuery] int id, int pageNumber, int pageSize)
        {
            var trans = await _transactionService.GetTransactionsByUserAsync(id, pageNumber, pageSize);
            if (trans == null)
            {
                Message = "No Records!";
                return NotFound(Message);
            }
            var nTra = _mapper.Map<List<TransactionDisplayDTO>>(trans);
            return Ok(nTra);
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