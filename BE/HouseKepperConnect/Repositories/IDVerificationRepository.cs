using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class IDVerificationRepository : IIDVerificationRepository
    {
        public async Task<int> AddIDVerifyAsync(IDVerification veri) => await IDVerifyDAO.Instance.AddIDVerifyAsync(veri);

        public async Task<List<IDVerification>> GetAllIDVerifysAsync() => await IDVerifyDAO.Instance.GetAllIDVerifysAsync();

        public async Task<IDVerification> GetIDVerifyByIDAsync(int id) => await IDVerifyDAO.Instance.GetIDVerifyByIDAsync(id);

        public async Task UpdateIDVerifyAsync(IDVerification veri) => await IDVerifyDAO.Instance.UpdateIDVerifyAsync(veri);
    }
}