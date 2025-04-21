using BusinessObject.Models;

namespace Repositories.Interface
{
    public interface IPlatformFeeRepository
    {
        Task<List<PlatformFee>> GetAllPlatformFeesAsync(int pageNumber, int pageSize);

        Task<PlatformFee> GetPlatformFeeByIDAsync(int fID);

        Task AddPlatformFeeAsync(PlatformFee PlatformFee);

        Task DeletePlatformFeeAsync(int id);

        Task UpdatePlatformFeeAsync(PlatformFee PlatformFee);
    }
}