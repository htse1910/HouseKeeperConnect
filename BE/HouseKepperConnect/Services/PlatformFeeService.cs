using BusinessObject.Models;
using Repositories.Interface;
using Services.Interface;

namespace Services
{
    public class PlatformFeeService : IPlatformFeeService
    {
        private readonly IPlatformFeeRepository _platformFeeRepository;

        public PlatformFeeService(IPlatformFeeRepository platformFeeRepository)
        {
            _platformFeeRepository = platformFeeRepository;
        }

        public async Task AddPlatformFeeAsync(PlatformFee PlatformFee) => await _platformFeeRepository.AddPlatformFeeAsync(PlatformFee);

        public async Task DeletePlatformFeeAsync(int id) => await _platformFeeRepository.DeletePlatformFeeAsync(id);

        public async Task<List<PlatformFee>> GetAllPlatformFeesAsync(int pageNumber, int pageSize) => await _platformFeeRepository.GetAllPlatformFeesAsync(pageNumber, pageSize);

        public async Task<PlatformFee> GetPlatformFeeByIDAsync(int fID) => await _platformFeeRepository.GetPlatformFeeByIDAsync(fID);

        public async Task UpdatePlatformFeeAsync(PlatformFee PlatformFee) => await _platformFeeRepository.UpdatePlatformFeeAsync(PlatformFee);
    }
}