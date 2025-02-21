using BusinessObject.Models.PayOS;
using Net.payOS.Types;

namespace Services.Interface
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentLink(CreatePaymentLinkRequest request);

        Task<PaymentLinkInformation> GetPaymentStatus(long orderID);
    }
}