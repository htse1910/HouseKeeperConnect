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

        public async Task<int> AddIDVerifyAsync(IDVerification veri) => await _iDVerificationRepository.AddIDVerifyAsync(veri);

        public async Task<List<IDVerification>> GetAllIDVerifysAsync(int pageNumber, int pageSize) => await _iDVerificationRepository.GetAllIDVerifysAsync(pageNumber, pageSize);

        public async Task<IDVerification> GetIDVerifyByIDAsync(int id) => await _iDVerificationRepository.GetIDVerifyByIDAsync(id);

        public async Task UpdateIDVerifyAsync(IDVerification veri) => await _iDVerificationRepository.UpdateIDVerifyAsync(veri);
    }
}