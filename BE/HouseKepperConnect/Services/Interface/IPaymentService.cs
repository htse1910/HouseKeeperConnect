using BusinessObject.Models;
using BusinessObject.Models.PayOS;
using Net.payOS.Types;

namespace Services.Interface
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentLink(CreatePaymentLinkRequest request);

        Task<PaymentLinkInformation> GetPaymentStatus(int orderID);
        Task<List<Payment>> GetAllPaymentsAsync(int pageNumber, int pageSize);
        Task<Payment> GetPaymentByIDAsync(int rID);
        Task<List<Payment>> GetPaymentsByFamilyAsync(int familyID, int pageNumber, int pageSize);
        Task AddPaymentAsync(Payment Payment);
        Task DeletePaymentAsync(int id);
        Task UpdatePaymentAsync(Payment Payment);
    }
}