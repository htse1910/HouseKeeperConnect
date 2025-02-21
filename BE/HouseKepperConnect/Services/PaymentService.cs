using BusinessObject.Models.PayOS;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using Services.Interface;

namespace Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly string _domain;
        private readonly PayOS _payOS;

        public PaymentService(IConfiguration configuration)
        {
            _configuration = configuration;
            PayOSSettings payOS = new PayOSSettings()
            {
                ClientId = _configuration.GetValue<string>("Environment:PAYOS_CLIENT_ID"),
                ApiKey = _configuration.GetValue<string>("Environment:PAYOS_API_KEY"),
                ChecksumKey = _configuration.GetValue<string>("Environment:PAYOS_CHECKSUM_KEY")
            };
            _payOS = new PayOS(payOS.ClientId, payOS.ApiKey, payOS.ChecksumKey);
            _domain = _configuration.GetValue<string>("Environment:Domain");
        }

        public async Task<string> CreatePaymentLink(CreatePaymentLinkRequest body)
        {
            List<ItemData> items = new List<ItemData>();

            PaymentData paymentData = new PaymentData(
                body.orderId,
                body.price,
                body.description,
                items,
                $"{_domain}/api/payment/cancel?id={body.orderId}",
                $"{_domain}/api/payment/success?id={body.orderId}",
                null,
                body.buyerName,
                body.buyerEmail,
                null,
                null,
                body.expriedAt
            );

            CreatePaymentResult createPayment = await _payOS.createPaymentLink(paymentData);
            if (createPayment == null || string.IsNullOrEmpty(createPayment.checkoutUrl))
            {
                throw new Exception("Failed to create payment link");
            }

            return createPayment.checkoutUrl;
        }

        public async Task<PaymentLinkInformation> GetPaymentStatus(long orderID)
        {
            /*var order = await _orderService.GetOrderByIdAsync(orderID);

            if (order == null)
            {
                throw new Exception("Order not found not found");
            }

            var paymentStatus = await _payOS.getPaymentLinkInformation(orderID);

            return paymentStatus;*/
            return null;
        }
    }
}