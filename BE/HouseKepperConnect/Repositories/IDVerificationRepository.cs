using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public class IDVerificationRepository : IIDVerificationRepository
    {
        public async Task AddIDVerifyAsync(IDVerification veri) => await IDVerifyDAO.Instance.AddIDVerifyAsync(veri);

        public async Task<List<IDVerification>> GetAllIDVerifysAsync() => await IDVerifyDAO.Instance.GetAllIDVerifysAsync();

        public async Task<IDVerification> GetIDVerifyByIDAsync(int id) => await IDVerifyDAO.Instance.GetIDVerifyByIDAsync(id);
    }
}
