using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IPaymentRepository
    {
        Task<List<Payment>> GetAllPaymentsAsync(int pageNumber, int pageSize);
        Task<Payment> GetPaymentByIDAsync(int rID);
        Task<List<Payment>> GetPaymentsByFamilyAsync(int familyID);
        Task AddPaymentAsync(Payment Payment);
        Task DeletePaymentAsync(int id);
        Task UpdatePaymentAsync(Payment Payment);
    }
}
