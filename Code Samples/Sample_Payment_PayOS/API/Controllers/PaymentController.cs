using API.Models;
using Microsoft.AspNetCore.Mvc;
using Net.payOS;
using Net.payOS.Types;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PayOS _payOS;
        private readonly IConfiguration _configuration;
        private readonly string _domain;

        public PaymentController(IConfiguration configuration)
        {
            _configuration = configuration;
            PayOSSetting payOS = new PayOSSetting()
            {
                ClientId = _configuration.GetValue<string>("Environment:PAYOS_CLIENT_ID"),
                ApiKey = _configuration.GetValue<string>("Environment:PAYOS_API_KEY"),
                ChecksumKey = _configuration.GetValue<string>("Environment:PAYOS_CHECKSUM_KEY")
            };
            _payOS = new PayOS(payOS.ClientId, payOS.ApiKey, payOS.ChecksumKey);
            _domain = _configuration.GetValue<string>("Environment:Domain");
        }

        // GET: PaymentController

        // POST: PaymentController/Create
        [HttpPost("Deposit")]
        public async Task<IActionResult> Deposit(string email, decimal balance)
        {
            try
            {
                int orderCode = int.Parse(DateTimeOffset.Now.ToString("ffffff"));
                int expriedAt = (int)(DateTimeOffset.UtcNow.ToUnixTimeSeconds() + (60 * 5));
                ItemData item = new ItemData("Nạp tiền vào ví", 1, (int)balance);
                List<ItemData> items = new List<ItemData> { item };

                PaymentData paymentData = new PaymentData(
                        orderCode,
                        (int)balance,
                        item.name,
                        items,
                        $"{_domain}/api/payment/cancel",
                        $"{_domain}/api/payment/success",
                        null,
                        "",
                        email,
                        null,
                        null,
                        expriedAt
                );

                CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);

                string Url = createPayment.checkoutUrl;

                return Redirect(Url);
            }
            catch
            {
                return BadRequest();
            }
        }

        // GET: PaymentController/Edit/5
    }
}