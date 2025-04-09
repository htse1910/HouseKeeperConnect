using BusinessObject.Models;
using BusinessObject.Models.Enum;
using Microsoft.AspNetCore.Authorization;
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
        private readonly IFamilyProfileService _familyProfileService;
        private readonly INotificationService _notificationService;
        private string Message;

        public PaymentController(ITransactionService transactionService, IWalletService walletService, IPaymentService paymentService, INotificationService notificationService, IFamilyProfileService familyProfileService)
        {
            _transactionService = transactionService;
            _walletService = walletService;
            _paymentService = paymentService;
            _notificationService = notificationService;
            _familyProfileService = familyProfileService;
        }


        [HttpGet("GetPaymentList")]
        [Authorize(Policy ="Admin")]
        public async Task<ActionResult<List<Payment>>> GetPayments(int pageNumber, int pageSize)
        {
            var list =await _paymentService.GetAllPaymentsAsync(pageNumber, pageSize);
            if (list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(list);
        }
        
        [HttpGet("GetPaymentsByFA")]
        [Authorize(Policy ="Family")]
        public async Task<ActionResult<List<Payment>>> GetPaymentsByFA([FromQuery]int accountID, int pageNumber, int pageSize)
        {
            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(accountID);
            if(fa == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var list =await _paymentService.GetPaymentsByFamilyAsync(fa.FamilyID, pageNumber, pageSize);
            if (list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(list);
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

            var noti = new Notification();
            noti.AccountID = trans.AccountID;
            noti.Message = "Bạn đã nạp " + trans.Amount+" VNĐ vào ví!";

            await _notificationService.AddNotificationAsync(noti);
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

                var noti = new Notification();
                noti.AccountID = trans.AccountID;
                noti.Message = "Bạn đã hủy nạp " + trans.Amount + " VNĐ vào ví!";

                await _notificationService.AddNotificationAsync(noti);
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

                var noti = new Notification();
                noti.AccountID = trans.AccountID;
                noti.Message = "Đơn " + trans.TransactionID + " đã hết hạn! Giao dịch thất bại!";

                await _notificationService.AddNotificationAsync(noti);
                return Ok(status.status);
            }

            return Ok(status.status);
        }
    }
}