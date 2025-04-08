using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        public async Task AddPaymentAsync(Payment Payment) => await PaymentDAO.Instance.AddPaymentAsync(Payment);

        public async Task DeletePaymentAsync(int id) => await PaymentDAO.Instance.DeletePaymentAsync(id);

        public async Task<List<Payment>> GetAllPaymentsAsync(int pageNumber, int pageSize) => await PaymentDAO.Instance.GetAllPaymentsAsync(pageNumber, pageSize);

        public async Task<Payment> GetPaymentByIDAsync(int rID) => await PaymentDAO.Instance.GetPaymentByIDAsync(rID);

        public async Task<List<Payment>> GetPaymentsByFamilyAsync(int familyID) => await PaymentDAO.Instance.GetPaymentsByFamilyAsync(familyID);

        public async Task UpdatePaymentAsync(Payment Payment) => await PaymentDAO.Instance.UpdatePaymentAsync(Payment);
    }
}
