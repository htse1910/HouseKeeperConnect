using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class IDVerificationService : IIDVerificationService
    {
        private readonly IIDVerificationRepository _iDVerificationRepository;

        public IDVerificationService(IIDVerificationRepository iDVerificationRepository)
        {
            _iDVerificationRepository = iDVerificationRepository;
        }

        public async Task AddIDVerifyAsync(IDVerification veri) => await _iDVerificationRepository.AddIDVerifyAsync(veri);

        public async Task<List<IDVerification>> GetAllIDVerifysAsync() => await _iDVerificationRepository.GetAllIDVerifysAsync();

        public async Task<IDVerification> GetIDVerifyByIDAsync(int id) => await _iDVerificationRepository.GetIDVerifyByIDAsync(id);
    }
}