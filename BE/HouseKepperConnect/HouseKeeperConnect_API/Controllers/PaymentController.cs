using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace HouseKeeperConnect_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IWalletService _walletService;
        private readonly IPaymentService _paymentService;
        private string Message;

        public PaymentController(ITransactionService transactionService, IWalletService walletService, IPaymentService paymentService)
        {
            _transactionService = transactionService;
            _walletService = walletService;
            _paymentService = paymentService;
        }

        [HttpGet("success")]
        public async Task<IActionResult> PaymentSuccess([FromQuery] int orderCode)
        {
            var check = await _paymentService.GetPaymentStatus(orderCode);

            if (check.status != "PAID")
            {
                Message = "Payment is not paid!";
                return BadRequest(Message);
            }

            var trans = await _transactionService.GetTransactionByIDAsync(orderCode);
            if (trans == null)
            {
                Message = "No transaction found!";
                return NotFound(Message);
            }

            trans.UpdatedDate = DateTime.Now;
            trans.Status = (int)TransactionStatus.Completed;

            await _transactionService.UpdateTransactionAsync(trans);

            var wallet = await _walletService.GetWalletByIDAsync(trans.WalletID);
            if (wallet == null)
            {
                Message = "No wallet found!";
                return NotFound(Message);
            }

            wallet.UpdatedAt = DateTime.Now;
            wallet.Balance += wallet.OnHold;
            wallet.OnHold -= wallet.OnHold;

            await _walletService.UpdateWalletAsync(wallet);
            Message = "PAID";

            return Ok(Message);
        }

        [HttpGet("cancel")]
        public async Task<IActionResult> PaymentFailed([FromQuery] int orderCode)
        {
            var check = await _paymentService.GetPaymentStatus(orderCode);

            if (check.status == "CANCELLED")
            {
                var trans = await _transactionService.GetTransactionByIDAsync(orderCode);
                if (trans == null)
                {
                    Message = "No transaction found!";
                    return NotFound(Message);
                }

                trans.UpdatedDate = DateTime.Now;
                trans.Status = (int)TransactionStatus.Canceled;

                await _transactionService.UpdateTransactionAsync(trans);

                var wallet = await _walletService.GetWalletByIDAsync(trans.WalletID);
                if (wallet == null)
                {
                    Message = "No wallet found!";
                    return NotFound(Message);
                }

                wallet.UpdatedAt = DateTime.Now;
                wallet.OnHold -= trans.Amount;

                await _walletService.UpdateWalletAsync(wallet);
                return Ok("CANCELLED");
            }
            Message = "Payment is paid!";
            return Ok(Message);
        }

        [HttpGet("CheckStatus")]
        public async Task<IActionResult> PaymentStatus([FromQuery] int id)
        {
            var status = await _paymentService.GetPaymentStatus(id);
            if (status == null)
            {
                Message = "Transaction not found!";
                return NotFound(Message);
            }
            if (status.status == "EXPIRED")
            {
                var trans = await _transactionService.GetTransactionByIDAsync(id);
                if (trans == null)
                {
                    Message = "No transaction found!";
                    return NotFound(Message);
                }

                if (trans.Status == (int)TransactionStatus.Expired)
                {
                    return Ok(status.status);
                }

                trans.UpdatedDate = DateTime.Now;
                trans.Status = (int)TransactionStatus.Expired;

                await _transactionService.UpdateTransactionAsync(trans);

                var wallet = await _walletService.GetWalletByIDAsync(trans.WalletID);
                if (wallet == null)
                {
                    Message = "No wallet found!";
                    return NotFound(Message);
                }

                wallet.UpdatedAt = DateTime.Now;
                wallet.OnHold -= trans.Amount;

                await _walletService.UpdateWalletAsync(wallet);
                return Ok(status.status);
            }

            return Ok(status.status);
        }
    }
}