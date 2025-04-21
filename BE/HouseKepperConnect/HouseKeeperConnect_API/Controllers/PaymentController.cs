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
    public class PaymentController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IWalletService _walletService;
        private readonly IPaymentService _paymentService;
        private readonly IFamilyProfileService _familyProfileService;
        private readonly INotificationService _notificationService;
        private readonly IJobService _jobService;
        private readonly IJob_ServiceService _job_service;
        private readonly IHouseKeeperService _houseKeeperService;
        private string Message;

        public PaymentController(ITransactionService transactionService, IWalletService walletService,
            IPaymentService paymentService, INotificationService notificationService,
            IFamilyProfileService familyProfileService, IJobService jobService, IJob_ServiceService job_ServiceService, IHouseKeeperService houseKeeperService)
        {
            _transactionService = transactionService;
            _walletService = walletService;
            _paymentService = paymentService;
            _notificationService = notificationService;
            _familyProfileService = familyProfileService;
            _jobService = jobService;
            _job_service = job_ServiceService;
            _houseKeeperService = houseKeeperService;
        }

        [HttpGet("GetPaymentList")]
        [Authorize(Policy = "Admin")]
        public async Task<ActionResult<List<Payment>>> GetPayments(int pageNumber, int pageSize)
        {
            var list = await _paymentService.GetAllPaymentsAsync(pageNumber, pageSize);
            if (list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }

            return Ok(list);
        }

        [HttpGet("GetPaymentsByFA")]
        [Authorize(Policy = "Family")]
        public async Task<ActionResult<List<Payment>>> GetPaymentsByFA([FromQuery] int accountID, int pageNumber, int pageSize)
        {
            var fa = await _familyProfileService.GetFamilyByAccountIDAsync(accountID);
            if (fa == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var list = await _paymentService.GetPaymentsByFamilyAsync(fa.FamilyID, pageNumber, pageSize);
            if (list == null)
            {
                Message = "No records!";
                return NotFound(Message);
            }
            var display = new List<PaymentIDisplayDTO>();

            foreach (var item in list)
            {
                var job = await _jobService.GetJobByIDAsync(item.JobID);
                if (job == null)
                {
                    Message = "No job found!";
                    return NotFound(Message);
                }

                var jobDetail = await _jobService.GetJobDetailByJobIDAsync(job.JobID);
                if (jobDetail == null)
                {
                    Message = "No job detail found!";
                    return NotFound(Message);
                }

                var hk = await _houseKeeperService.GetHousekeeperByIDAsync(jobDetail.HousekeeperID.GetValueOrDefault());
                if (hk == null)
                {
                    Message = "No Housekeeper found!";
                    return NotFound(Message);
                }

                var services = await _job_service.GetJob_ServicesByJobIDAsync(job.JobID);
                if (services == null)
                {
                    Message = "No records!";
                    return NotFound(Message);
                }

                var serList = new List<int>();
                foreach (var service in services)
                {
                    serList.Add(service.ServiceID);
                }

                var dis = new PaymentIDisplayDTO();
                dis.Services = serList;
                dis.Status = (int)PaymentStatus.Completed;
                dis.Amount = item.Amount;
                dis.HousekeeperID = hk.HousekeeperID;
                dis.Nickname = hk.Account.Nickname;
                dis.PaymentID = item.PaymentID;
                dis.JobID = job.JobID;
                dis.JobName = job.JobName;
                dis.PaymentDate = DateTime.Now;
                dis.Commission = jobDetail.Price * 0.1m;

                display.Add(dis);
            }
            return Ok(display);
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
            noti.Message = "Bạn đã nạp " + trans.Amount + " VNĐ vào ví!";

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
        [Authorize]
        public async Task<IActionResult> PaymentCheckStatus([FromQuery] int id)
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