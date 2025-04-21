using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IPaymentRepository
    {
        Task<List<Payment>> GetAllPaymentsAsync(int pageNumber, int pageSize);

        Task<Payment> GetPaymentByIDAsync(int rID);

        Task<List<Payment>> GetPaymentsByFamilyAsync(int familyID, int pageNumber, int pageSize);

        Task AddPaymentAsync(Payment Payment);

        Task DeletePaymentAsync(int id);

        Task UpdatePaymentAsync(Payment Payment);
    }
}