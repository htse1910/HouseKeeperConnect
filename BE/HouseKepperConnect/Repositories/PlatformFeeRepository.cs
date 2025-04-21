using BusinessObject.Models;
using DataAccess;
using Repositories.Interface;

namespace Repositories
{
    public class PlatformFeeRepository : IPlatformFeeRepository
    {
        public async Task AddPlatformFeeAsync(PlatformFee PlatformFee) => await PlatformFeeDAO.Instance.AddPlatformFeeAsync(PlatformFee);

        public async Task DeletePlatformFeeAsync(int id) => await PlatformFeeDAO.Instance.DeletePlatformFeeAsync(id);

        public async Task<List<PlatformFee>> GetAllPlatformFeesAsync(int pageNumber, int pageSize) => await PlatformFeeDAO.Instance.GetAllPlatformFeesAsync(pageNumber, pageSize);

        public async Task<PlatformFee> GetPlatformFeeByIDAsync(int fID) => await PlatformFeeDAO.Instance.GetPlatformFeeByIDAsync(fID);

        public async Task UpdatePlatformFeeAsync(PlatformFee PlatformFee) => await PlatformFeeDAO.Instance.UpdatePlatformFeeAsync(PlatformFee);
    }
}