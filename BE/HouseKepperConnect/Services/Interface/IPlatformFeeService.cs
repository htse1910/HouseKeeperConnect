using BusinessObject.Models;

namespace Services.Interface
{
    public interface IPlatformFeeService
    {
        Task<List<PlatformFee>> GetAllPlatformFeesAsync(int pageNumber, int pageSize);

        Task<PlatformFee> GetPlatformFeeByIDAsync(int fID);

        Task AddPlatformFeeAsync(PlatformFee PlatformFee);

        Task DeletePlatformFeeAsync(int id);

        Task UpdatePlatformFeeAsync(PlatformFee PlatformFee);
    }
}