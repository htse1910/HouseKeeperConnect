using BusinessObject.Models;
using BusinessObject.Models.PayOS;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Net.payOS;
using Net.payOS.Types;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _configuration;
        private readonly ITransactionService _transactionService;
        private readonly IPaymentRepository _paymentRepository;
        private readonly string _client;
        private readonly PayOS _payOS;

        public PaymentService(IConfiguration configuration, ITransactionService transactionService, IPaymentRepository paymentRepository)
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
            _paymentRepository = paymentRepository;
        }

        public async Task AddPaymentAsync(Payment Payment) => await _paymentRepository.AddPaymentAsync(Payment);


        public async Task DeletePaymentAsync(int id) => await _paymentRepository.DeletePaymentAsync(id);

        public async Task<List<Payment>> GetAllPaymentsAsync(int pageNumber, int pageSize) => await _paymentRepository.GetAllPaymentsAsync(pageNumber, pageSize);

        public async Task<Payment> GetPaymentByIDAsync(int rID) => await _paymentRepository.GetPaymentByIDAsync(rID);

        public async Task<List<Payment>> GetPaymentsByFamilyAsync(int familyID, int pageNumber, int pageSize) => await _paymentRepository.GetPaymentsByFamilyAsync(familyID, pageNumber, pageSize);
        public async Task UpdatePaymentAsync(Payment Payment) => await _paymentRepository.UpdatePaymentAsync(Payment);

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

    }
}