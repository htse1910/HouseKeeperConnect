using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class PaymentDAO
    {
        private static PaymentDAO instance;
        public static readonly object instancelock = new object();

        public PaymentDAO()
        { }

        public static PaymentDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new PaymentDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Payment>> GetAllPaymentsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Payment>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Payment.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Payment> GetPaymentByIDAsync(int rID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Payment.FirstOrDefaultAsync(r => r.PaymentID == rID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Payment>> GetPaymentsByFamilyAsync(int familyID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Payment.Where(r => r.FamilyID == familyID).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddPaymentAsync(Payment Payment)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Payment.Add(Payment);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeletePaymentAsync(int id)
        {
            var Payment = await GetPaymentByIDAsync(id);
            if (Payment != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Payment.Remove(Payment);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdatePaymentAsync(Payment Payment)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(Payment).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
