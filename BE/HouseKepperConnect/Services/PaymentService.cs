using BusinessObject.Models.PayOS;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using Services.Interface;

namespace Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly ITransactionService _transactionService;
        private readonly string _client;
        private readonly PayOS _payOS;

        public PaymentService(IConfiguration configuration, ITransactionService transactionService, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            PayOSSettings payOS = new PayOSSettings()
            {
                ClientId = _configuration.GetValue<string>("Environment:PAYOS_CLIENT_ID"),
                ApiKey = _configuration.GetValue<string>("Environment:PAYOS_API_KEY"),
                ChecksumKey = _configuration.GetValue<string>("Environment:PAYOS_CHECKSUM_KEY")
            };
            _payOS = new PayOS(payOS.ClientId, payOS.ApiKey, payOS.ChecksumKey);
            _client = _configuration.GetValue<string>("Client");
            _transactionService = transactionService;
        }

        public async Task<string> CreatePaymentLink(CreatePaymentLinkRequest body)
        {
            List<ItemData> items = new List<ItemData>();

            PaymentData paymentData = new PaymentData(
                body.transID,
                body.price,
                body.description,
                items,
                $"{_client}/family/deposit/return?status=cancelled&id={body.transID}",
                $"{_client}/family/deposit/return?status=success&id={body.transID}",
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

        public async Task<PaymentLinkInformation> GetPaymentStatus(int transID)
        {
            var trans = await _transactionService.GetTransactionByIDAsync(transID);

            if (trans == null)
            {
                throw new Exception("Transaction not found");
            }

            var paymentStatus = await _payOS.getPaymentLinkInformation(transID);

            return paymentStatus;
        }
    }
}