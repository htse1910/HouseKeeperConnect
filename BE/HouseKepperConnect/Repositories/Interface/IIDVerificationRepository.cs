using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IIDVerificationRepository
    {
        Task<List<IDVerification>> GetAllIDVerifysAsync();
        Task<IDVerification> GetIDVerifyByIDAsync(int id);
        Task AddIDVerifyAsync(IDVerification veri);
    }
}
