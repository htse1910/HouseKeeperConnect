using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;
using Repositories.Interface;

namespace Repositories
{
    public class PayoutRepository : IPayoutRepository
    {
        public Task AddPayoutAsync(Payout Payout)
        {
            throw new NotImplementedException();
        }

        public Task DeletePayoutAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Payout>> GetAllPayoutsAsync(int pageNumber, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task<Payout> GetPayoutByIDAsync(int rID)
        {
            throw new NotImplementedException();
        }

        public Task<List<Payout>> GetPayoutsByHKAsync(int hkID, int pageNumber, int pageSize)
        {
            throw new NotImplementedException();
        }

        public Task UpdatePayoutAsync(Payout Payout)
        {
            throw new NotImplementedException();
        }
    }
}
