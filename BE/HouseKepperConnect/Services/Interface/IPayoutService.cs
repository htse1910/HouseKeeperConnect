using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models;

namespace Services.Interface
{
    public interface IPayoutService
    {
        Task<List<Payout>> GetAllPayoutsAsync(int pageNumber, int pageSize);
        Task<Payout> GetPayoutByIDAsync(int rID);
        Task<List<Payout>> GetPayoutsByHKAsync(int hkID, int pageNumber, int pageSize);
        Task AddPayoutAsync(Payout Payout);
        Task DeletePayoutAsync(int id);
        Task UpdatePayoutAsync(Payout Payout);
    }
}
