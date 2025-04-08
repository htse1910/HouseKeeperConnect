using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class PayoutDAO
    {
        private static PayoutDAO instance;
        public static readonly object instancelock = new object();

        public PayoutDAO()
        { }

        public static PayoutDAO Instance
        {
            get
            {
                lock (instancelock)
                {
                    if (instance == null)
                    {
                        instance = new PayoutDAO();
                    }
                    return instance;
                }
            }
        }

        public async Task<List<Payout>> GetAllPayoutsAsync(int pageNumber, int pageSize)
        {
            var list = new List<Payout>();
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    list = await context.Payout.AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return list;
        }

        public async Task<Payout> GetPayoutByIDAsync(int rID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Payout.FirstOrDefaultAsync(r => r.PayoutID == rID);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<Payout>> GetPayoutsByHKAsync(int hkID)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    return await context.Payout.Where(r => r.HousekeeperID == hkID).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddPayoutAsync(Payout Payout)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Payout.Add(Payout);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task DeletePayoutAsync(int id)
        {
            var Payout = await GetPayoutByIDAsync(id);
            if (Payout != null)
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Payout.Remove(Payout);
                    await context.SaveChangesAsync();
                }
            }
        }

        public async Task UpdatePayoutAsync(Payout Payout)
        {
            try
            {
                using (var context = new PCHWFDBContext())
                {
                    context.Entry(Payout).State = EntityState.Modified;
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
