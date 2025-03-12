using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IIDVerificationRepository
    {
        Task<List<IDVerification>> GetAllIDVerifysAsync();

        Task<IDVerification> GetIDVerifyByIDAsync(int id);

        Task AddIDVerifyAsync(IDVerification veri);

        Task UpdateIDVerifyAsync(IDVerification veri);
    }
}